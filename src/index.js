const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

const qnaRoutes = require('./routes/qnaRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/qna', qnaRoutes)
app.use('/api/upload', uploadRoutes)

const port = process.env.PORT || 5050
app.listen(port, () => {
	console.log(`🚀 Server listening on port ${port}`)
})
