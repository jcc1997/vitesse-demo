# 需求总结 — JINCH-10: 部署验证服务

## 背景

- 项目为 vite 构建的 TypeScript 单页应用 (vitesse-demo)，用于部署验证控制台。
- 在 CI/CD 流程中，平台需要启动一个可访问的 dev-server 对当前构建进行远程验证（Playwright 浏览器测试）。
- 之前的验证流程依赖 `vite build` 构建产物部署至静态站点后才能触发验证，缺少实时 dev-server 验证环节。
- 本次需求增加 `deploy:validate` script，让 CI 管道可以直接启动一个绑定到所有网络接口的 dev-server，供外部验证工具访问。

## 功能

- 功能说明：
  - 在 `package.json` 的 `scripts` 中新增 `deploy:validate` 命令：`vite --host 0.0.0.0`
  - `--host 0.0.0.0` 将 dev-server 绑定至所有网络接口，使容器外部/CI 运行器可以访问
  - dev-server 默认端口为 5173（vite 默认值），可通过 `--port` 参数覆盖
  - 该 script 不改变任何现有行为（`dev`、`build`、`preview` 保持不变）
- 对应 PR：<!-- 将由平台填写 -->
- 代码目录：`package.json`
  - `scripts.deploy:validate` — 新增 `"deploy:validate": "vite --host 0.0.0.0"`

## 注意事项

- `--host 0.0.0.0` 会监听所有网络接口，在生产环境使用时需确保网络安全策略（如防火墙、鉴权代理）到位。当前此仓库仅为内部验证用途，风险可控。
- 该 dev-server 为开发模式（unbundled），性能低于生产构建的 `preview` 模式，但对于 Playwright 验证测试来说完全足够。
- 如果 CI 环境需要自定义端口，可以通过 `vite --host 0.0.0.0 --port 3000` 覆盖。
- 确保 CI 运行器中已安装 pnpm + Node.js，且 `pnpm install` 在 `deploy:validate` 之前执行。

## 经验总结

- `vite dev` 默认绑定 `localhost`，只能本地访问；增加 `--host 0.0.0.0` 是让容器/CI 外部可访问的标准做法。
- 测试验证：
  - `pnpm tsc --noEmit` — 类型检查通过
  - `pnpm build` — vite 构建成功
  - `pnpm deploy:validate` 启动后可通过 `HTTP GET http://localhost:5173/vitesse-demo/` 得到 200 响应
- 如果后续需要支持 HTTPS（如某些浏览器安全策略），可以在 `vite.config.ts` 中配置 `server.https`。
- 如果需要端口环境变量化，可以改为 `"deploy:validate": "vite --host 0.0.0.0 --port ${PORT:-5173}"` 使 CI 可覆盖端口。
