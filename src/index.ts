import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  API_SECRET_KEY: string   // 在 Cloudflare 后台设置的环境变量
}

const app = new Hono<{ Bindings: Bindings }>()

// ====================== 中间件 ======================
// 允许你的博客前端跨域访问
app.use('/api/*', cors({
  origin: ['https://your-blog.com', 'http://localhost:3000'], // 支持多个域名
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ====================== 路由 ======================

// 1. 获取说说列表（支持分页 + 只返回公开的）
app.get('/api/moments', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT id, content, images, location, weather, mood, created_at, likes 
      FROM moments 
      WHERE is_public = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    const total = await c.env.DB.prepare("SELECT COUNT(*) as count FROM moments WHERE is_public = 1").first()

    return c.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: total?.count || 0
      }
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// 2. 获取单条说说详情
app.get('/api/moments/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM moments WHERE id = ?
    `).bind(id).first()

    if (!result) return c.json({ success: false, message: 'Not found' }, 404)

    return c.json({ success: true, data: result })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// 3. 发布新说说（带鉴权）
app.post('/api/moments', async (c) => {
  const body = await c.req.json()
  const { secret } = body

  // 密钥校验
  if (secret !== c.env.API_SECRET_KEY) {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }

  try {
    const { content, images, location, weather, mood, is_public = 1 } = body

    const result = await c.env.DB.prepare(`
      INSERT INTO moments (content, images, location, weather, mood, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(content, images, location, weather, mood, is_public).run()

    return c.json({ 
      success: true, 
      message: '发布成功！',
      id: result.meta.last_row_id 
    })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})
export default app