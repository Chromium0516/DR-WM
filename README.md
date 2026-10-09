# DR-WM 论文展示主页

本项目已整理为 GitHub Pages 迁移版本，来自 2026-09-30 的最新页面，使用公开项目仓库 `Chromium0516/DR-WM`。项目地址为 `https://chromium0516.github.io/DR-WM/`，发布状态可在仓库的 Actions 页面查看。

本版参考 WonderPlay 的论文展示网页：标题与资源入口居中，依次展示多地形预测、模型与鸟瞰轨迹对比、同一地图下两个候选动作的预测后果。各部分通过 Demo 标签切换，一次只加载一个场景；场景内部的视频始终并排，窄屏可横向滚动。实验表格默认折叠。采用 React + Vite 静态构建，无需后端、数据库或 Lovable 运行环境。

主页为英文，使用用户提供论文中的主图、原始帧、对比图，`or_fix.zip` 中的 16 段地形预测视频，以及 `ortherWM.zip` 中的 15 段模型视频和 5 段鸟瞰轨迹。论文下载、代码和数据集链接仍待补充；作者沿用论文中的匿名信息。图像与视频来源见 `asset-sources.json`。

## 快速预览

本包包含完整源代码和本地视频资源。使用 Node.js 22.16 或更高版本：

```bash
npm ci
npm run dev
```

重新生成静态文件：

```bash
npm run build
```

构建命令先运行 TypeScript 检查，再输出 `dist/index.html`、CSS、JavaScript 和本地图像。`base: "./"` 兼容个人首页及仓库子目录路径。

## 部署到 github.io

上传本项目源码到 GitHub 仓库，使用包内的 `.github/workflows/pages.yml`。

1. 新建公开仓库 `DR-WM`，将本目录的全部内容放在仓库根目录，默认分支为 `main`。请包含 `.github/workflows/pages.yml`；不要将 ZIP 文件本身作为网站内容上传。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送提交，或从 Actions 手动运行 `Deploy DR-WM to GitHub Pages`。
4. 工作流执行 `npm ci`、`npm run build`，并发布 `dist/`。

源码仓库不跟踪 `dist/` 和 `node_modules/`，由 GitHub Actions 安装锁定依赖、构建并发布。所有视频直接放在 `public/videos/`，无需额外视频服务。Windows 用户可使用 GitHub Desktop 上传整个目录，以保留子目录与工作流文件。

仓库命名为 `USERNAME.github.io` 时使用个人首页地址；普通项目仓库使用 `https://USERNAME.github.io/REPOSITORY/`。本次采用独立项目仓库，保留个人主页。

参考：[GitHub Pages 发布源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 替换内容

| 修改目标 | 文件 / 配置 |
| --- | --- |
| 顶部单位 logo | `src/components/InstitutionLogos.tsx` 和 `src/assets/institutions/`；顺序为 DEEP Robotics、浙江大学、MIT、北京理工大学；官方来源见 `institution-logo-sources.json` |
| 作者名称 | `src/content/site.ts` 的 `authors`；正式发布时同步调整 `src/Home.tsx` 中的匿名审稿说明 |
| Paper / Supplementary / Code / Dataset | `src/content/site.ts` 的 `resources`，将对应 `url: null` 改为真实地址 |
| 四个场景 × 四类地形视频 | `public/videos/terrain-scenes/demo{1–4}-{normal,mud,cobblestone,snow}.mp4`；同名 `.webp` 为视频首帧封面；展示布局和场景标签见 `src/components/TerrainVideoGallery.tsx` |
| 五组模型与鸟瞰轨迹视频 | `public/videos/model-comparisons/`；布局和场景标签见 `src/components/ModelComparisonGallery.tsx` |
| 两组动作选择后果视频 | `public/videos/action-outcomes/` 中的 `gravel-action-{1,2}.mp4` 和 `mud-action-{1,2}-v2.mp4`；同名 `.webp` 为视频封面；展示见 `src/components/ActionOutcomeGallery.tsx` |
| 正文和方法介绍 | `src/Home.tsx` |
| 表格数据 | `src/components/ResultTables.tsx` |
| 论文配图 | `src/assets/`，直接替换同名文件 |
| 色彩、字号与间距 | `src/styles.css` 及组件样式 |

主展示区的列顺序为 Original terrain、Mud、Cobblestone、Snow，对应上传包中的 `or`、`muddy`、`cob`、`snow`。每行提供一起播放、暂停和重播，也保留每段视频的原生控制和全屏入口。视频按需加载，以首帧图片作封面，无默认自动播放。

上线视频保留原始 1280 × 704 分辨率、10 fps、60 帧和 6 秒时长，以 H.264、CRF 23 转码，并将 MP4 元数据前置，便于网页播放。未裁剪、改速或插帧。替换时请保留同一场景下的地形对应关系，并同步更新封面。

模型对比区按 Cosmos 3、LingBot-World、DR-WM、Trajectory (Bird’s-eye View) 排列，共五行。每行四段视频覆盖同一个 8 秒时间范围，并提供同步播放、暂停和重播。原始帧率与分辨率均保留；视频已经是 H.264、yuv420p 和 faststart 格式。由于上传包没有注明鸟瞰轨迹只属于哪一个模型，网页使用中性标题，不把它归为 DR-WM 专属轨迹。

如需论文下载，可自行把最终公开版本放入 `public/papers/paper.pdf`，再将 Paper 的地址设为 `"./papers/paper.pdf"`。本包未包含完整论文 PDF。

第三部分来自 `demo.zip`，包含碎石与泥地两组地图。每组仅并排显示两种动作的预测视频：碎石或泥地路线，与普通土路路线。支持一起播放、暂停、重播和单段全屏。切换 Demo 会停止旧视频并取消待播放请求。碎石两段为 12 秒；泥地两段为 12.1 秒。泥地 Action 01 已替换为用户后续上传的 `ef7e563320737b51e8843d362a8a108b.mp4`，直接复制 H.264 视频流并前置元数据；原泥地 Action 01 按用户要求移到 Dirt route（Action 02）。其余上传包视频采用 H.264、CRF 23、yuv420p 和 faststart。全部视频保留源分辨率、10 fps、全部帧和时长，未裁剪、改速或插帧。替换视频使用新的文件名以避免浏览器旧缓存。来源与映射见 `action-outcome-sources.json`。

所有本地资源链接请使用 `./...` 相对路径，避免以 `/` 开头，以兼容 GitHub Pages 仓库子目录。

## 本版状态

- 居中论文标题、深色圆角资源按钮、图片缩略图选择器和大幅结果展示。
- 16 段地形视频通过四个 Demo 切换，当前场景四列并排，支持组播放和独立视频控制。
- 20 段模型与轨迹视频通过五个 Demo 切换，当前场景四列并排比较 Cosmos 3、LingBot-World、DR-WM 与鸟瞰轨迹。
- 第三部分通过两个 Demo 切换地图，并排展示同一地图下两种动作的后果。
- 已移除论文逐帧示例及雪地上坡对比的折叠区域，前两部分只展示可切换的 Demo 视频。
- 概览图和机器人采集拼图支持放大；实验表格可展开。
- 尚未提供的资源下载保留 Coming soon 状态。
- 数据来自用户提供的正文表 2 / 表 4，保留实验条件说明。
- 最后的 Observation fidelity 结果表按用户要求不再展示 NWM 和 EgoWM，其余方法及数据保留。
- 构建包含类型检查；静态资源路径经过检查。
- 网站源代码与视频在本仓库维护；向 `main` 推送修改后，GitHub Actions 会自动更新 GitHub Pages。
- 迁移版本保留最新页面及全部视频，包含雪地视频、动作选择视频及结果表格的最新修改。

设计参考：[WonderPlay](https://kyleleey.github.io/WonderPlay/)。版式重新实现，未使用参考项目的研究素材。

Mulish 字体随包提供，字体授权见 `public/fonts/Mulish-OFL.txt`。

[Lovable 首版编辑地址](https://lovable.dev/projects/118a0aaf-2285-4c77-b650-88e555dcf70a)
