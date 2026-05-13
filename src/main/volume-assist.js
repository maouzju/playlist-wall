const { execFileSync, spawn } = require('child_process')

const VOLUME_ASSIST_TARGET_APP = 'app'
const VOLUME_ASSIST_TARGET_SYSTEM = 'system'
const VOLUME_ASSIST_DEFAULT_HOTKEY = 'Alt'
const VOLUME_ASSIST_STEP = 0.2
const WINDOWS_WHEEL_LISTENER_STDERR_LIMIT = 4096

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function normalizeVolumeAssistTarget(input) {
  return input === VOLUME_ASSIST_TARGET_SYSTEM
    ? VOLUME_ASSIST_TARGET_SYSTEM
    : VOLUME_ASSIST_TARGET_APP
}

function normalizeVolumeAssistHotkey(input) {
  const tokens = String(input || '')
    .split('+')
    .map((token) => token.trim())
    .filter(Boolean)

  const modifierMap = new Map([
    ['control', 'Ctrl'],
    ['ctrl', 'Ctrl'],
    ['shift', 'Shift'],
    ['alt', 'Alt'],
    ['option', 'Alt'],
    ['meta', 'Meta'],
    ['cmd', 'Meta'],
    ['command', 'Meta'],
    ['super', 'Meta'],
    ['win', 'Meta'],
    ['windows', 'Meta'],
  ])
  const modifierOrder = ['Ctrl', 'Shift', 'Alt', 'Meta']
  const modifiers = new Set()
  let mainKey = ''

  for (const token of tokens) {
    const mappedModifier = modifierMap.get(token.toLowerCase())
    if (mappedModifier) {
      modifiers.add(mappedModifier)
      continue
    }

    if (!mainKey) {
      mainKey = token.length === 1 ? token.toUpperCase() : token
    }
  }

  const parts = modifierOrder.filter((modifier) => modifiers.has(modifier))
  if (mainKey) {
    parts.push(mainKey)
  }

  return parts.length ? parts.join('+') : VOLUME_ASSIST_DEFAULT_HOTKEY
}

function normalizeVolumeAssistSettings(input = {}) {
  const raw = input && typeof input === 'object' ? input : {}
  return {
    enabled: Boolean(raw.enabled),
    target: normalizeVolumeAssistTarget(raw.target),
    hotkey: normalizeVolumeAssistHotkey(raw.hotkey),
  }
}

function parseHotkeyParts(hotkey) {
  const parts = normalizeVolumeAssistHotkey(hotkey).split('+').filter(Boolean)
  const modifiers = new Set()
  let key = ''

  for (const part of parts) {
    if (part === 'Ctrl' || part === 'Shift' || part === 'Alt' || part === 'Meta') {
      modifiers.add(part)
    } else if (!key) {
      key = part
    }
  }

  return { modifiers, key }
}

function isHotkeyPressed(inputEvent = {}, hotkey) {
  const { modifiers, key } = parseHotkeyParts(hotkey)

  if (modifiers.has('Ctrl') && !inputEvent.control) {
    return false
  }
  if (modifiers.has('Shift') && !inputEvent.shift) {
    return false
  }
  if (modifiers.has('Alt') && !inputEvent.alt) {
    return false
  }
  if (modifiers.has('Meta') && !inputEvent.meta) {
    return false
  }

  if (!key) {
    return modifiers.size > 0
  }

  const pressedKey = String(inputEvent.key || '').trim()
  if (!pressedKey) {
    return false
  }

  return pressedKey.toLowerCase() === key.toLowerCase()
}

function getWheelDirection(inputEvent = {}) {
  const deltaY = Number(inputEvent.deltaY || 0)
  const deltaX = Number(inputEvent.deltaX || 0)

  if (Math.abs(deltaY) >= Math.abs(deltaX) && deltaY !== 0) {
    return deltaY < 0 ? 1 : -1
  }

  if (deltaX !== 0) {
    return deltaX < 0 ? 1 : -1
  }

  return 0
}


function getWindowsVirtualKeyForHotkeyKey(key) {
  const normalizedKey = String(key || '').trim()
  if (!normalizedKey) {
    return 0
  }

  if (normalizedKey.length === 1) {
    const upper = normalizedKey.toUpperCase()
    const code = upper.charCodeAt(0)
    if ((code >= 65 && code <= 90) || (code >= 48 && code <= 57)) {
      return code
    }
  }

  const keyMap = new Map([
    ['Space', 0x20],
    ['Escape', 0x1B],
    ['Esc', 0x1B],
    ['Enter', 0x0D],
    ['Return', 0x0D],
    ['Tab', 0x09],
    ['Backspace', 0x08],
    ['Delete', 0x2E],
    ['Insert', 0x2D],
    ['Home', 0x24],
    ['End', 0x23],
    ['PageUp', 0x21],
    ['PageDown', 0x22],
    ['Left', 0x25],
    ['Up', 0x26],
    ['Right', 0x27],
    ['Down', 0x28],
    ['ArrowLeft', 0x25],
    ['ArrowUp', 0x26],
    ['ArrowRight', 0x27],
    ['ArrowDown', 0x28],
  ])

  if (/^F(?:[1-9]|1[0-9]|2[0-4])$/i.test(normalizedKey)) {
    return 0x70 + Number(normalizedKey.slice(1)) - 1
  }

  return keyMap.get(normalizedKey) || keyMap.get(normalizedKey[0]?.toUpperCase() + normalizedKey.slice(1)) || 0
}

function parseWindowsHookHotkey(hotkey) {
  const { modifiers, key } = parseHotkeyParts(hotkey)
  return {
    hotkey: normalizeVolumeAssistHotkey(hotkey),
    ctrl: modifiers.has('Ctrl'),
    shift: modifiers.has('Shift'),
    alt: modifiers.has('Alt'),
    meta: modifiers.has('Meta'),
    keyVk: getWindowsVirtualKeyForHotkeyKey(key),
  }
}

function buildWindowsVolumeAssistHookScript(hookHotkey) {
  const config = {
    ctrl: Boolean(hookHotkey?.ctrl),
    shift: Boolean(hookHotkey?.shift),
    alt: Boolean(hookHotkey?.alt),
    meta: Boolean(hookHotkey?.meta),
    keyVk: Math.max(0, Math.trunc(Number(hookHotkey?.keyVk || 0))),
    targetSystem: hookHotkey?.target === VOLUME_ASSIST_TARGET_SYSTEM,
    step: clamp(Number(hookHotkey?.step) || VOLUME_ASSIST_STEP, 0.05, 20),
  }
  const configJson = JSON.stringify(config).replace(/'/g, "''")

  return `
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$assistConfig = '${configJson}' | ConvertFrom-Json
Add-Type -TypeDefinition @"
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

public static class VolumeAssistWheelHook {
  private const int WH_MOUSE_LL = 14;
  private const int WM_MOUSEWHEEL = 0x020A;
  private const int WM_MOUSEHWHEEL = 0x020E;
  private const int VK_CONTROL = 0x11;
  private const int VK_SHIFT = 0x10;
  private const int VK_MENU = 0x12;
  private const int VK_LWIN = 0x5B;
  private const int VK_RWIN = 0x5C;
  private const byte VK_VOLUME_DOWN = 0xAE;
  private const byte VK_VOLUME_UP = 0xAF;
  private const uint KEYEVENTF_KEYUP = 0x0002;

  private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);
  private static readonly LowLevelMouseProc Proc = HookCallback;
  private static IntPtr HookId = IntPtr.Zero;

  public static bool RequireCtrl;
  public static bool RequireShift;
  public static bool RequireAlt;
  public static bool RequireMeta;
  public static int MainKeyVk;
  public static bool TargetSystem;
  public static double Step;

  [StructLayout(LayoutKind.Sequential)]
  private struct POINT {
    public int x;
    public int y;
  }

  [StructLayout(LayoutKind.Sequential)]
  private struct MSLLHOOKSTRUCT {
    public POINT pt;
    public uint mouseData;
    public uint flags;
    public uint time;
    public IntPtr dwExtraInfo;
  }

  [StructLayout(LayoutKind.Sequential)]
  private struct MSG {
    public IntPtr hwnd;
    public uint message;
    public IntPtr wParam;
    public IntPtr lParam;
    public uint time;
    public POINT pt;
  }

  [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
  private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelMouseProc lpfn, IntPtr hMod, uint dwThreadId);

  [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
  private static extern bool UnhookWindowsHookEx(IntPtr hhk);

  [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
  private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

  [DllImport("user32.dll")]
  private static extern short GetAsyncKeyState(int vKey);

  [DllImport("user32.dll")]
  private static extern sbyte GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);

  [DllImport("user32.dll")]
  private static extern bool TranslateMessage([In] ref MSG lpMsg);

  [DllImport("user32.dll")]
  private static extern IntPtr DispatchMessage([In] ref MSG lpmsg);

  [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
  private static extern IntPtr GetModuleHandle(string lpModuleName);

  [DllImport("user32.dll")]
  private static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

  private static bool IsPressed(int virtualKey) {
    return (GetAsyncKeyState(virtualKey) & unchecked((short)0x8000)) != 0;
  }

  private static bool IsHotkeyPressed() {
    if (RequireCtrl && !IsPressed(VK_CONTROL)) return false;
    if (RequireShift && !IsPressed(VK_SHIFT)) return false;
    if (RequireAlt && !IsPressed(VK_MENU)) return false;
    if (RequireMeta && !IsPressed(VK_LWIN) && !IsPressed(VK_RWIN)) return false;
    if (MainKeyVk > 0 && !IsPressed(MainKeyVk)) return false;
    return RequireCtrl || RequireShift || RequireAlt || RequireMeta || MainKeyVk > 0;
  }

  private static void AdjustSystemVolume(int direction) {
    byte virtualKey = direction > 0 ? VK_VOLUME_UP : VK_VOLUME_DOWN;
    int repeat = Math.Max(1, Math.Min(20, (int)Math.Round(Step / 0.2, MidpointRounding.AwayFromZero)));
    for (int index = 0; index < repeat; index++) {
      keybd_event(virtualKey, 0, 0, UIntPtr.Zero);
      keybd_event(virtualKey, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
    }
  }

  private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam) {
    if (nCode >= 0 && (wParam == (IntPtr)WM_MOUSEWHEEL || wParam == (IntPtr)WM_MOUSEHWHEEL) && IsHotkeyPressed()) {
      MSLLHOOKSTRUCT hookStruct = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
      int delta = unchecked((short)((hookStruct.mouseData >> 16) & 0xffff));
      int direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
      if (direction != 0) {
        if (TargetSystem) {
          AdjustSystemVolume(direction);
        } else {
          Console.Out.WriteLine("{\\\"direction\\\":" + direction.ToString(System.Globalization.CultureInfo.InvariantCulture) + "}");
          Console.Out.Flush();
        }
        return (IntPtr)1;
      }
    }

    return CallNextHookEx(HookId, nCode, wParam, lParam);
  }

  public static int Run() {
    using (Process currentProcess = Process.GetCurrentProcess())
    using (ProcessModule currentModule = currentProcess.MainModule) {
      HookId = SetWindowsHookEx(WH_MOUSE_LL, Proc, GetModuleHandle(currentModule.ModuleName), 0);
    }

    if (HookId == IntPtr.Zero) {
      int error = Marshal.GetLastWin32Error();
      Console.Error.WriteLine("Failed to install volume assist mouse hook: " + error.ToString(System.Globalization.CultureInfo.InvariantCulture));
      return error == 0 ? 1 : error;
    }

    try {
      MSG msg;
      while (GetMessage(out msg, IntPtr.Zero, 0, 0) > 0) {
        TranslateMessage(ref msg);
        DispatchMessage(ref msg);
      }
    } finally {
      if (HookId != IntPtr.Zero) {
        UnhookWindowsHookEx(HookId);
        HookId = IntPtr.Zero;
      }
    }

    return 0;
  }
}
"@
[VolumeAssistWheelHook]::RequireCtrl = [bool]$assistConfig.ctrl
[VolumeAssistWheelHook]::RequireShift = [bool]$assistConfig.shift
[VolumeAssistWheelHook]::RequireAlt = [bool]$assistConfig.alt
[VolumeAssistWheelHook]::RequireMeta = [bool]$assistConfig.meta
[VolumeAssistWheelHook]::MainKeyVk = [int]$assistConfig.keyVk
[VolumeAssistWheelHook]::TargetSystem = [bool]$assistConfig.targetSystem
[VolumeAssistWheelHook]::Step = [double]$assistConfig.step
exit [VolumeAssistWheelHook]::Run()
`.trim()
}

function parseVolumeAssistWheelLine(line) {
  const text = String(line || '').trim()
  if (!text) {
    return 0
  }

  try {
    const payload = JSON.parse(text)
    const direction = Number(payload?.direction || 0)
    return Number.isFinite(direction) && direction !== 0 ? (direction > 0 ? 1 : -1) : 0
  } catch {
    return 0
  }
}

function createWindowsVolumeAssistWheelListener(options = {}) {
  if (process.platform !== 'win32') {
    return null
  }

  const spawnImpl = typeof options.spawnImpl === 'function' ? options.spawnImpl : spawn
  const onWheel = typeof options.onWheel === 'function' ? options.onWheel : null
  const onExit = typeof options.onExit === 'function' ? options.onExit : null
  const logger = options.logger || console
  const settings = normalizeVolumeAssistSettings({ enabled: true, hotkey: options.hotkey })
  const hookHotkey = {
    ...parseWindowsHookHotkey(settings.hotkey),
    target: normalizeVolumeAssistTarget(options.target),
    step: options.step,
  }
  if (!hookHotkey.ctrl && !hookHotkey.shift && !hookHotkey.alt && !hookHotkey.meta && !hookHotkey.keyVk) {
    throw new Error('Invalid volume assist hotkey')
  }

  const child = spawnImpl(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', buildWindowsVolumeAssistHookScript(hookHotkey)],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] }
  )

  let stdoutBuffer = ''
  let stderrBuffer = ''
  let stopped = false

  if (child?.stdout && typeof child.stdout.on === 'function') {
    child.stdout.on('data', (chunk) => {
      stdoutBuffer += String(chunk || '')
      let newlineIndex = stdoutBuffer.indexOf('\n')
      while (newlineIndex >= 0) {
        const line = stdoutBuffer.slice(0, newlineIndex)
        stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1)
        const direction = parseVolumeAssistWheelLine(line)
        if (direction && onWheel) {
          onWheel(direction)
        }
        newlineIndex = stdoutBuffer.indexOf('\n')
      }
    })
  }

  if (child?.stderr && typeof child.stderr.on === 'function') {
    child.stderr.on('data', (chunk) => {
      stderrBuffer = (stderrBuffer + String(chunk || '')).slice(-WINDOWS_WHEEL_LISTENER_STDERR_LIMIT)
    })
  }

  if (typeof child?.on === 'function') {
    child.on('error', (error) => {
      if (!stopped && logger && typeof logger.warn === 'function') {
        logger.warn('volume assist wheel listener failed', error)
      }
    })

    child.on('exit', (code, signal) => {
      if (!stopped && logger && typeof logger.warn === 'function') {
        logger.warn('volume assist wheel listener exited', {
          code,
          signal,
          stderr: stderrBuffer.trim(),
        })
      }
      if (onExit) {
        onExit({ code, signal, stopped, stderr: stderrBuffer.trim() })
      }
    })
  }

  return {
    hotkey: settings.hotkey,
    target: hookHotkey.target,
    process: child,
    stop() {
      stopped = true
      if (child && !child.killed && typeof child.kill === 'function') {
        child.kill()
      }
    },
  }
}

function adjustWindowsSystemVolume(direction, step = VOLUME_ASSIST_STEP) {
  if (process.platform !== 'win32') {
    throw new Error('系统音量辅助调节当前只支持 Windows。')
  }

  if (!Number.isFinite(Number(direction)) || Number(direction) === 0) {
    throw new Error('Invalid volume direction')
  }

  const normalizedDirection = direction > 0 ? 1 : -1
  const safeStep = clamp(Number(step) || VOLUME_ASSIST_STEP, 0.05, 20)
  const virtualKey = normalizedDirection > 0 ? '0xAF' : '0xAE'
  const repeatCount = Math.max(1, Math.round(safeStep / 0.2))
  const script = [
    'Add-Type -TypeDefinition \'using System; using System.Runtime.InteropServices; public static class VolumeKeys { [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo); }\'',
    `$vk = [byte]${virtualKey}`,
    `for ($i = 0; $i -lt ${repeatCount}; $i++) { [VolumeKeys]::keybd_event($vk, 0, 0, [UIntPtr]::Zero); [VolumeKeys]::keybd_event($vk, 0, 2, [UIntPtr]::Zero) }`,
  ].join('; ')

  execFileSync(
    'powershell.exe',
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
    { windowsHide: true, stdio: 'pipe', timeout: 3000 }
  )
}

module.exports = {
  VOLUME_ASSIST_DEFAULT_HOTKEY,
  VOLUME_ASSIST_TARGET_APP,
  VOLUME_ASSIST_TARGET_SYSTEM,
  VOLUME_ASSIST_STEP,
  normalizeVolumeAssistSettings,
  normalizeVolumeAssistHotkey,
  parseHotkeyParts,
  isHotkeyPressed,
  getWheelDirection,
  getWindowsVirtualKeyForHotkeyKey,
  parseWindowsHookHotkey,
  buildWindowsVolumeAssistHookScript,
  parseVolumeAssistWheelLine,
  createWindowsVolumeAssistWheelListener,
  adjustWindowsSystemVolume,
}
