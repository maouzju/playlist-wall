# 歌单墙 / Playlist Wall

把网易云音乐里分散、难翻、难搜的歌单，摊成一整面真正适合管理的"歌单墙"。

核心目标不是做另一个播放器，而是把"找歌"和"整理歌单"这件事做得更舒服。

![img_v3_0210d_677347b2-96bb-4afb-b345-20321a47e27g](https://github.com/user-attachments/assets/58c4dd8f-c7a9-47b8-be46-9e729bc51750)

## 下载

- Windows 发布版统一放在 GitHub Releases: <https://github.com/maouzju/playlist-wall/releases>
- 最新版本下载页: <https://github.com/maouzju/playlist-wall/releases/latest>

## 非官方声明

- 本项目是独立第三方客户端，与网易云音乐、NetEase Cloud Music 及其关联方不存在隶属、赞助或官方合作关系。
- "网易云音乐"、"NetEase Cloud Music" 及相关名称、标识、界面素材的权利归各自权利人所有。
- 项目功能依赖社区维护的非官方接口，仅适合个人学习、研究与自用场景。使用者需自行评估并遵守目标平台的服务条款、版权规则和当地法律法规。
- 仓库代码以 MIT 协议开源，但第三方服务、品牌、音乐内容、专辑封面和接口返回数据不因本仓库开源而改变其原有权利归属。

完整说明见 [DISCLAIMER.md](DISCLAIMER.md)。

## 开源合规

- 第三方 npm 依赖许可证清单见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
- 依赖变更后可运行 `npm run third-party:notices` 重新生成该清单。
- 当前许可证清单基于仓库内已安装的 `node_modules` 和 `package-lock.json` 生成；不同平台打包时，实际携带的可选依赖可能略有差异。

## 功能

- 高密度瀑布流一次展示全库歌单，按"自己创建 / 收藏订阅"分区
- 为任意歌单请求相似推荐曲目，一键加入目标歌单（基于歌单已有风格，由网易云接口提供）
- 右键移除歌曲，或把"我喜欢的音乐"里的歌移动到更合适的歌单
- 搜索歌单名、歌曲名、专辑名、歌手名，直接找到歌曲而不用先想起它在哪张歌单
- 点任意歌曲即播放；可一键定位当前播放歌曲，自动滚回对应歌单位置
- 支持主题切换、界面缩放、基础播放控制
- 二维码登录，不依赖本机客户端；歌单数据后台渐进加载并本地缓存

## 快速开始

```bash
npm install
npm start
```

首次启动后扫码登录，即可进入歌单墙。

## 测试

```bash
npm run test:ui
```

## 快捷操作

| 按键 | 功能 |
|------|------|
| `/` | 聚焦搜索框 |
| `Space` | 播放 / 暂停 |
| `1` / `2` | 切到"自己创建"/"收藏订阅" |
| `P` / `N` | 上一首 / 下一首 |
| `Esc` | 关闭菜单、预览或设置面板 |

## 项目结构

```text
src/main/       Electron 主进程、网易云接口封装、登录态/缓存存储
src/renderer/   歌单墙界面、搜索、播放、推荐、右键整理逻辑
tests/          Playwright UI 测试
scripts/        启动与辅助脚本
assets/         图标资源
```

## 技术栈

- Electron
- NeteaseCloudMusicApi
- Playwright

## 注意事项

- 需要可用的网易云音乐账号
- 某些私密歌单或接口异常时，歌单可能暂时无法完整展开
- 某些歌曲受版权或账号权限影响，可能只有试听片段

## 本地数据与登录态

- 登录态、偏好设置、播放统计和歌单缓存会写入 Electron 的 `userData` 目录，不会回写到仓库目录。
- 登录 cookie 保存在 `userData/session.json`。
- 在支持的平台上，程序会优先使用 Electron `safeStorage` 对 cookie 做系统级保护后再落盘。
- 如果当前环境不支持 `safeStorage`，程序仍会保持登录态，但会退回到明文 `session.json` 持久化，并在应用内给出警告。
- 旧版本留下的明文 `session.json` 会在下次成功读取时自动迁移到受保护存储；如果当前环境不支持安全存储，则会继续按明文格式保留。
- 在共享设备上使用时，建议定期退出登录，或手动清理 `userData` 目录中的本地缓存与登录态文件。

## License

MIT，见 [LICENSE](LICENSE)。
