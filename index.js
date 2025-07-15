const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()

const qnaRoutes = require('./src/routes/qnaRoutes')
const uploadRoutes = require('./src/routes/uploadRoutes')
const authRoutes = require('./src/routes/auth')

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api/qna', qnaRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/auth', authRoutes)

// app.use(express.static(path.join(__dirname, 'dist')))
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

console.log(path.join(__dirname, 'dist', 'index.html'))

const port = process.env.PORT || 8080

app.listen(port, '0.0.0.0', () => {
	console.log(`🚀 Server listening on port ${port}`)
})
