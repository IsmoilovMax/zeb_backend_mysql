// server.js
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import contact from './routes/contact.js'
import qnaRoutes from './routes/qna.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.json())

// API route
app.use('/api/contact', contact)
app.use('/api/qna', qnaRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
