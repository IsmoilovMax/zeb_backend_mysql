const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// Faylni saqlash joyi va nomi
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = 'src/uploads'
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath)
		}
		cb(null, uploadPath)
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname}`
		cb(null, uniqueName)
	},
})

const upload = multer({ storage })

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ success: false, message: '파일이 없습니다.' })
	}

	const fileUrl = `http://localhost:5050/uploads/${req.file.filename}`

	res.status(200).json({
		success: true,
		file: {
			name: req.file.originalname,
			type: req.file.mimetype,
			url: fileUrl,
		},
	})
})

module.exports = router
