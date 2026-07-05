<<<<<<< HEAD
```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
=======
# Hono-Moments

**Cloudflare Workers + D1 驱动的轻量朋友圈**

一个专为个人和小型社区设计的**即时动态分享平台解决方案**，让你和朋友们可以像微信朋友圈一样随时分享生活。

### ✨ 特性

- **Serverless**：无需购买 VPS，直接跑在 Cloudflare Workers
- **高性能**：Hono 框架 + D1 数据库，响应极快
- **功能完善**：支持增删查改主要功能和点赞等次要功能
- **隐私友好**：数据完全掌握在自己手中

### 🛠 技术栈

- **框架**：Hono
- **部署平台**：Cloudflare Workers
- **数据库**：Cloudflare D1
- **语言**：TypeScript

### 🚀 快速开始
自己猜
>>>>>>> a4a508ff07376d094c0b86b2ff3025a33b9b20b2
