const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json')
const PACKAGE_LOCK_PATH = path.join(ROOT, 'package-lock.json')
const OUTPUT_PATH = path.join(ROOT, 'THIRD_PARTY_NOTICES.md')

const LICENSE_FILE_CANDIDATES = [
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'LICENCE',
  'LICENCE.md',
  'LICENCE.txt',
  'COPYING',
  'COPYING.md',
  'COPYING.txt',
]

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

function normalizeLicense(packageJson) {
  if (typeof packageJson.license === 'string' && packageJson.license.trim()) {
    return packageJson.license.trim()
  }

  if (Array.isArray(packageJson.licenses) && packageJson.licenses.length > 0) {
    const parts = packageJson.licenses
      .map((entry) => {
        if (typeof entry === 'string' && entry.trim()) {
          return entry.trim()
        }
        if (entry && typeof entry.type === 'string' && entry.type.trim()) {
          return entry.type.trim()
        }
        return ''
      })
      .filter(Boolean)

    if (parts.length > 0) {
      return parts.join(' OR ')
    }
  }

  return ''
}

function findLicenseFile(packageDir) {
  for (const fileName of LICENSE_FILE_CANDIDATES) {
    const filePath = path.join(packageDir, fileName)
    if (fileExists(filePath)) {
      return filePath
    }
  }
  return ''
}

function inferLicenseFromText(text) {
  if (!text) {
    return ''
  }

  if (/Permission is hereby granted, free of charge, to any person obtaining a copy/i.test(text)
    && /THE SOFTWARE IS PROVIDED ["']AS IS["']/i.test(text)) {
    return 'MIT'
  }

  if (/Apache License/i.test(text) && /Version 2\.0/i.test(text)) {
    return 'Apache-2.0'
  }

  if (/Blue Oak Model License/i.test(text)) {
    return 'BlueOak-1.0.0'
  }

  if (/GNU LESSER GENERAL PUBLIC LICENSE/i.test(text)) {
    return 'LGPL'
  }

  if (/GNU GENERAL PUBLIC LICENSE/i.test(text)) {
    return 'GPL'
  }

  if (/Redistribution and use in source and binary forms/i.test(text)
    && /Neither the name of/i.test(text)) {
    return 'BSD-3-Clause'
  }

  if (/Redistribution and use in source and binary forms/i.test(text)) {
    return 'BSD-like'
  }

  return ''
}

function resolveLicense(packageDir, packageJson) {
  const declared = normalizeLicense(packageJson)
  if (declared) {
    return {
      license: declared,
      source: 'package.json',
      licenseFilePath: findLicenseFile(packageDir),
    }
  }

  const licenseFilePath = findLicenseFile(packageDir)
  if (licenseFilePath) {
    const inferred = inferLicenseFromText(fs.readFileSync(licenseFilePath, 'utf8'))
    if (inferred) {
      return {
        license: inferred,
        source: 'license-file-heuristic',
        licenseFilePath,
      }
    }
  }

  return {
    license: 'UNKNOWN',
    source: 'missing',
    licenseFilePath,
  }
}

function formatMarkdownLink(relativePath) {
  return relativePath ? `[\`${relativePath}\`](./${relativePath.replace(/\\/g, '/')})` : ''
}

function formatScope(scope) {
  if (scope === 'runtime') {
    return 'direct-runtime'
  }
  if (scope === 'dev') {
    return 'direct-dev'
  }
  return 'transitive'
}

function isSpecialReviewLicense(license) {
  return /(GPL|LGPL|AGPL|MPL|CC-|BlueOak|EPL|CDDL|UNKNOWN|\sOR\s|\sAND\s)/i.test(license)
}

function collectPackages() {
  const rootPackage = readJson(PACKAGE_JSON_PATH)
  const packageLock = readJson(PACKAGE_LOCK_PATH)
  const directRuntime = new Set(Object.keys(rootPackage.dependencies || {}))
  const directDev = new Set(Object.keys(rootPackage.devDependencies || {}))
  const rows = []

  for (const packagePath of Object.keys(packageLock.packages || {})) {
    if (!packagePath.startsWith('node_modules/')) {
      continue
    }

    const packageDir = path.join(ROOT, packagePath)
    const packageJsonPath = path.join(packageDir, 'package.json')
    if (!fileExists(packageJsonPath)) {
      continue
    }

    const packageJson = readJson(packageJsonPath)
    const name = packageJson.name || packagePath.replace(/^node_modules[\\/]/, '')
    const version = packageJson.version || ''
    const dedupeKey = `${name}@${version}`
    const licenseInfo = resolveLicense(packageDir, packageJson)
    const scope = directRuntime.has(name) ? 'runtime' : directDev.has(name) ? 'dev' : 'transitive'

    rows.push({
      dedupeKey,
      name,
      version,
      scope,
      license: licenseInfo.license,
      licenseSource: licenseInfo.source,
      licenseFilePath: licenseInfo.licenseFilePath
        ? path.relative(ROOT, licenseInfo.licenseFilePath).replace(/\\/g, '/')
        : '',
    })
  }

  const unique = new Map()
  for (const row of rows) {
    if (!unique.has(row.dedupeKey)) {
      unique.set(row.dedupeKey, row)
    }
  }

  return [...unique.values()].sort((left, right) => {
    if (left.name !== right.name) {
      return left.name.localeCompare(right.name)
    }
    return left.version.localeCompare(right.version)
  })
}

function buildMarkdown(packages) {
  const rootPackage = readJson(PACKAGE_JSON_PATH)
  const directRuntimeNames = Object.keys(rootPackage.dependencies || {}).sort()
  const directDevNames = Object.keys(rootPackage.devDependencies || {}).sort()
  const packageByName = new Map(packages.map((item) => [item.name, item]))
  const licenseCounts = new Map()

  for (const item of packages) {
    licenseCounts.set(item.license, Number(licenseCounts.get(item.license) || 0) + 1)
  }

  const licenseSummary = [...licenseCounts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1]
      }
      return left[0].localeCompare(right[0])
    })
    .map(([license, count]) => `| ${license} | ${count} |`)

  const specialReview = packages
    .filter((item) => isSpecialReviewLicense(item.license))
    .map((item) => {
      const notes = []
      if (/LGPL/i.test(item.license)) {
        notes.push('copyleft component')
      }
      if (/\sOR\s|\sAND\s/i.test(item.license)) {
        notes.push('multi-license expression')
      }
      if (/UNKNOWN/i.test(item.license)) {
        notes.push('manual follow-up needed')
      }
      if (/BlueOak/i.test(item.license)) {
        notes.push('uncommon but permissive')
      }

      return `| ${item.name} | ${item.version} | ${item.license} | ${formatScope(item.scope)} | ${notes.join(', ') || 'review'} |`
    })

  const packageTable = packages.map((item) => {
    return `| ${item.name} | ${item.version} | ${item.license} | ${formatScope(item.scope)} | ${item.licenseSource} | ${formatMarkdownLink(item.licenseFilePath)} |`
  })

  const runtimeDirect = directRuntimeNames
    .map((name) => packageByName.get(name))
    .filter(Boolean)
    .map((item) => `- \`${item.name}@${item.version}\` (${item.license})`)

  const devDirect = directDevNames
    .map((name) => packageByName.get(name))
    .filter(Boolean)
    .map((item) => `- \`${item.name}@${item.version}\` (${item.license})`)

  return [
    '# Third-Party Notices',
    '',
    'This file is generated by `npm run third-party:notices` from the currently installed `node_modules` tree and `package-lock.json`.',
    '',
    '## Scope',
    '',
    'Runtime direct dependencies:',
    ...runtimeDirect,
    '',
    'Direct development dependencies:',
    ...devDirect,
    '',
    'Project-specific notes:',
    '- `NeteaseCloudMusicApi` is the community-maintained unofficial API integration this project relies on for service access.',
    '- `sharp` is only used by `scripts/generate-icon.js` for local icon asset generation in this repository.',
    '',
    '## License Summary',
    '',
    '| License | Package count |',
    '| --- | ---: |',
    ...licenseSummary,
    '',
    '## Packages Requiring Extra Review',
    '',
    '| Package | Version | License | Scope | Why review |',
    '| --- | --- | --- | --- | --- |',
    ...(specialReview.length > 0 ? specialReview : ['| None | - | - | - | - |']),
    '',
    '## Full Package List',
    '',
    '| Package | Version | License | Scope | Source | License file |',
    '| --- | --- | --- | --- | --- | --- |',
    ...packageTable,
    '',
  ].join('\n')
}

function main() {
  const packages = collectPackages()
  const markdown = buildMarkdown(packages)
  fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8')
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)}`)
}

main()
