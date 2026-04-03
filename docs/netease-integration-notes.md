# 网易云接口集成笔记

更新时间：2026-04-04

这份文档用于记录当前项目的接口实现基线、近期调研结论，以及后续维护时值得持续关注的点。

## 当前项目基线

- 当前项目在主进程中直接使用 `NeteaseCloudMusicApi 4.30.0`，而不是额外启动本地 sidecar API 服务。
- 登录、歌单读取、播放地址获取、歌单收藏/取消收藏，均通过主进程的 `src/main/netease-service.js` 统一封装。
- 收藏与取消收藏当前都调用社区 API 提供的 `playlist_subscribe` 能力。
- 网络超时、连接重置、`502` 等瞬时错误会按既定策略重试。
- `405` 响应不再自动重试，界面会直接保留服务端返回的提示，避免重复提交同一操作。

## 当前已验证到的现象

- 在已复现的真实登录会话中，收藏歌单请求可能返回 `405 操作过于频繁，请稍后再试`。
- 这类响应已经在主进程侧做了更明确的错误透传，便于界面直接提示当前状态。
- 现阶段可以把这类问题视为“服务端限制类响应”，而不是单纯的本地请求超时。

## YesPlayMusic 调研结论

近期对 `qier222/YesPlayMusic` 的调用链做了针对性检查，结论如下：

- YesPlayMusic 的 Electron 版会先在本机启动一个本地 API 服务，再将前端 `/api` 请求统一代理到这个本地服务。
- 该本地服务依赖的是社区维护的 API fork：`@neteaseapireborn/api`。
- 这条依赖线当前已经继续迁移到 `@neteasecloudmusicapienhanced/api`，后者是更值得持续跟踪的维护分支。
- YesPlayMusic 的二维码登录仍然来自社区 API 暴露的 `login_qr_key`、`login_qr_create`、`login_qr_check` 等模块。
- YesPlayMusic 的播放链路以 `/song/url` 为主；未登录时会退回 `outer/url`；Electron 模式下还可以接入 `@unblockneteasemusic/rust-napi` 作为可选音源补充。
- YesPlayMusic 的歌单收藏接口仍然是普通的 `/playlist/subscribe` 调用；源码中没有看到专门针对收藏接口的额外处理链路。

## 对本项目的意义

- 如果后续需要增强接口层的可维护性，可以参考 YesPlayMusic 的“本地 API 服务 + 前端统一代理”结构。
- 如果后续需要增强播放可用性，可以单独评估“播放地址回退”与“可选音源补充”这两类策略。
- 仅切换为 sidecar API 结构，并不会自动改变歌单收藏接口的实际响应结果。
- 如果未来评估升级社区 API 依赖，优先关注 `@neteasecloudmusicapienhanced/api` 的更新与变更说明。

## 后续维护建议

- 持续跟踪社区 API 维护分支的版本更新、变更日志与 issue 修复记录。
- 对写操作继续保留原始服务端提示，避免把不同类型的失败都归因为网络异常。
- 任何涉及收藏、取消收藏、批量修改歌单的接口调整，都应优先做真实会话验证，而不只依赖本地 mock。

## 参考链接

- YesPlayMusic: <https://github.com/qier222/YesPlayMusic>
- `@neteaseapireborn/api`: <https://www.npmjs.com/package/@neteaseapireborn/api>
- `@neteasecloudmusicapienhanced/api`: <https://www.npmjs.com/package/@neteasecloudmusicapienhanced/api>
