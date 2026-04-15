# solo-lab Demo Web

This repository is a small frontend target used to exercise `solo-lab` end-to-end flows:

- branch-based changes
- pull request creation
- GitHub Actions deployment
- deployment callback into `solo-lab`
- remote browser validation with Playwright

## Commands

```bash
pnpm install
pnpm dev
pnpm build
```

## Deployment Workflow

The Pages workflow supports both:

- `push` to `main`
- manual `workflow_dispatch`

Manual dispatch accepts:

- `branch`
- `requirement_id`
- `callback_url`

When `callback_url` and `requirement_id` are provided, the workflow posts the deployment result back to:

`POST {callback_url}/requirements/{requirement_id}/environments/callback`
