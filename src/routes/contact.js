import express from 'express'
import db from '../db.js'

const router = express.Router()

// POST /api/contact
router.post('/', async (req, res) => {
	const { name, email, message } = req.body

	if (!name || !email || !message) {
		return res.status(400).json({ error: '모든 항목을 입력해주세요.' })
	}

	try {
		await db.execute(
			'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
			[name, email, message]
		)
		res.status(201).json({ message: '저장 성공' })
	} catch (error) {
		console.error('DB Error:', error)
		res.status(500).json({ error: '저장 실패' })
	}
})

// ✅ GET /api/contact — barcha contactlarni olish
router.get('/', async (req, res) => {
	try {
		const result = await db.execute(
			'SELECT * FROM contacts ORDER BY created_at DESC'
		)
		const [rows] = result // faqat bu yerdan destructuring qilinadi
		res.status(200).json(rows)
	} catch (error) {
		console.error('DB Error:', error)
		res.status(500).json({ error: '불러오기 실패' })
	}
})

// DELETE /api/contact/:id
router.delete('/:id', async (req, res) => {
	const { id } = req.params

	try {
		await db.execute('DELETE FROM contacts WHERE id = ?', [id])
		res.status(200).json({ message: '삭제 성공' })
	} catch (error) {
		console.error('삭제 실패:', error)
		res.status(500).json({ error: '삭제 실패' })
	}
})

export default router
