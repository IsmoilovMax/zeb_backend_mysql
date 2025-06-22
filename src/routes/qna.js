import express from 'express'
import db from '../db.js'

const router = express.Router()

// CREATE
router.post('/', async (req, res) => {
  const { title, author, date, content } = req.body
  if (!title || !author || !date || !content) {
    return res.status(400).json({ error: '모든 항목을 입력해주세요.' })
  }

  try {
    await db.execute(
      'INSERT INTO qna (title, author, date, content) VALUES (?, ?, ?, ?)',
      [title, author, date, content]
    )
    res.status(201).json({ message: '저장 성공' })
  } catch (err) {
    console.error('Insert Error:', err)
    res.status(500).json({ error: '저장 실패' })
  }
})

// PUT /api/qna/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params
  let { title, author, date, content } = req.body

  // ✅ Formatlash (faqat YYYY-MM-DD)
  if (date && date.includes('T')) {
    date = date.split('T')[0]
  }

  try {
    await db.execute(
      'UPDATE qna SET title = ?, author = ?, date = ?, content = ? WHERE id = ?',
      [title, author, date, content, id]
    )
    const [updated] = await db.execute('SELECT * FROM qna WHERE id = ?', [id])
    res.json(updated[0])
  } catch (error) {
    console.error('Update error:', error)
    res.status(500).json({ error: '업데이트 실패' })
  }
})

// READ
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM qna ORDER BY date DESC')
    res.json(rows)
  } catch (err) {
    console.error('Read Error:', err)
    res.status(500).json({ error: '불러오기 실패' })
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM qna WHERE id = ?', [req.params.id])
    res.json({ message: '삭제 완료' })
  } catch (err) {
    console.error('Delete Error:', err)
    res.status(500).json({ error: '삭제 실패' })
  }
})

export default router
