import express from 'express'
import recipeRoutes from './routes/recipes.routes'
import recognitionRoutes from './routes/recognition.routes'
import singupRoutes from './routes/singup.routes'
import noticeRoutes from './routes/notice.routes'
const app = express()

app.use(
  express.json({
    limit: '50mb',
  })
)
app.use(recipeRoutes)
app.use(singupRoutes)
app.use(recognitionRoutes)
app.use(noticeRoutes)

export default app
