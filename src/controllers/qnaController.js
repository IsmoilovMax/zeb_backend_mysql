import db from '../models/db.js'

export const submitQuestion = (req, res) => {
	if (!req.body || !req.body.title || !req.body.content || !req.body.author) {
		return res
			.status(400)
			.json({ error: 'Missing required fields in request body' })
	}

	const { title, content, author } = req.body
	const date = new Date()
	const query =
		'INSERT INTO qna (title, content, author, date, views) VALUES (?, ?, ?, ?, 0)'
	db.query(query, [title, content, author, date], (err, result) => {
		if (err) return res.status(500).json({ error: err })
		res.status(200).json({ id: result.insertId, ...req.body, views: 0 })
	})
}

export const getAllQuestions = (req, res) => {
	db.query('SELECT * FROM qna ORDER BY id DESC', (err, results) => {
		if (err) return res.status(500).json({ error: err })
		res.status(200).json(results)
	})
}

export const addComment = (req, res) => {
	const qnaId = req.params.id
	const { user, text } = req.body
	const query =
		'INSERT INTO comments (qna_id, user, text, createdAt) VALUES (?, ?, ?, NOW())'
	db.query(query, [qnaId, user, text], (err, result) => {
		if (err) return res.status(500).json({ error: err })
		res.status(200).json({
			id: result.insertId,
			qna_id: qnaId,
			user,
			text,
			createdAt: new Date(),
		})
	})
}

export const incrementView = (req, res) => {
	const qnaId = req.params.id
	const query = 'UPDATE qna SET views = views + 1 WHERE id = ?'
	db.query(query, [qnaId], err => {
		if (err) return res.status(500).json({ error: err })
		res.sendStatus(204)
	})
}

export const getSingleQuestion = (req, res) => {
	const qnaId = req.params.id
	const query = 'SELECT * FROM qna WHERE id = ?'

	db.query(query, [qnaId], (err, qnaResult) => {
		if (err) return res.status(500).json({ error: err })
		if (qnaResult.length === 0)
			return res.status(404).json({ error: 'Not found' })

		// Commentlarni olib kelish
		const commentQuery =
			'SELECT * FROM comments WHERE qna_id = ? ORDER BY createdAt ASC'
		db.query(commentQuery, [qnaId], (err, commentsResult) => {
			if (err) return res.status(500).json({ error: err })

			res.status(200).json({
				...qnaResult[0],
				comments: commentsResult,
			})
		})
	})
}
