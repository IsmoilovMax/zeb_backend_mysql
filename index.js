const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')

dotenv.config()

const qnaRoutes = require('./src/routes/qnaRoutes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use('/api/qna', qnaRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
