# Disclaimer

## Non-official status

This project is an independent third-party desktop client. It is not affiliated with, endorsed by, sponsored by, or officially supported by NetEase Cloud Music or its affiliates.

## Trademarks and service content

- "网易云音乐", "NetEase Cloud Music", and other related names, marks, and service identifiers remain the property of their respective rights holders.
- Music, cover art, playlist metadata, API responses, and other service-side content shown by this project remain subject to the original platform's terms and copyright rules.

## Interface and usage boundary

- This repository is a personal interest project intended primarily for learning and technical exchange.
- This repository uses a community-maintained unofficial API integration.
- Publishing this repository under MIT only applies to the code contained in this repository.
- Open-sourcing this repository does not grant any rights to third-party services, brands, or content.
- Use of third-party services through this project is your own responsibility. Please review and comply with the applicable service terms, copyright requirements, and local laws before using, distributing, or commercializing any derivative workflow.

## Local session storage

- The app stores login state in Electron `userData/session.json`.
- When the host environment supports Electron `safeStorage`, the session cookie is encrypted before being written to disk.
- When `safeStorage` is unavailable, the app keeps login persistence by falling back to plaintext storage and shows an in-app warning so the risk is explicit.
