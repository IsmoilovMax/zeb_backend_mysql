import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
dotenv.config()

import qnaRoutes from './routes/qnaRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/qna', qnaRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
