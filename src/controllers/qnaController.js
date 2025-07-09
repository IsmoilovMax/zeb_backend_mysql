const {
	insertQnaFiles,
	insertComment,
	getQnaPosts,
	getCommentsByPostId,
} = require('../models/qnaModule')
const db = require('../models/db')

// POST /api/qna  - Yangi QnA post yaratish
exports.createQnaPost = async (req, res) => {
	try {
		const {
			title,
			author,
			email,
			content,
			password,
			isPrivate = false,
			createdAt,
			files = [],
		} = req.body

		if (!title || !author || !content) {
			return res.status(400).json({
				success: false,
				message: '필수 필드 누락됨 (title, author, content).',
			})
		}

		const [result] = await db.query(
			`INSERT INTO qna_posts (title, author, email, content, password, is_private, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[
				title,
				author,
				email || null,
				content,
				password || null,
				isPrivate ? 1 : 0,
				createdAt || new Date(),
			]
		)

		const postId = result.insertId

		if (files.length > 0) {
			const formattedFiles = Array.isArray(files) ? files : JSON.parse(files)
			await insertQnaFiles(postId, formattedFiles)
		}

		res.status(201).json({ success: true, message: 'Post created', postId })
	} catch (error) {
		console.error('Qna Create Error:', error.message)
		res.status(500).json({ success: false, error: 'Server error' })
	}
}

// GET /api/qna  - Barcha QnA postlarini olish
exports.getQnaPosts = async (req, res) => {
	try {
		const posts = await getQnaPosts()
		res.status(200).json({ success: true, data: posts })
	} catch (error) {
		console.error('Qna Get All Error:', error.message)
		res.status(500).json({ success: false, error: 'Server error' })
	}
}

// DELETE /api/qna/:id
exports.deleteQnaPost = async (req, res) => {
	try {
		const postId = Number(req.params.id)

		if (isNaN(postId)) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid post ID' })
		}

		// Avval fayllarni o‘chirib tashlaymiz (agar `qna_files` jadvali bo‘lsa)
		await db.query('DELETE FROM qna_files WHERE post_id = ?', [postId])

		// Keyin postni o‘chirib tashlaymiz
		const [result] = await db.query('DELETE FROM qna_posts WHERE id = ?', [
			postId,
		])

		if (result.affectedRows === 0) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		res
			.status(200)
			.json({ success: true, message: 'Post deleted successfully' })
	} catch (error) {
		console.error('Delete Qna Error:', error)
		res.status(500).json({ success: false, error: 'Server error' })
	}
}

// GET /api/qna/:id  - ID bo‘yicha bitta postni (fayl va kommentlar bilan) olish
exports.getQnaPostById = async (req, res) => {
	try {
		const id = Number(req.params.id)
		const deviceId = req.headers['x-device-id']

		if (isNaN(id) || !deviceId) {
			return res.status(400).json({ success: false, message: 'Invalid data' })
		}

		const [
			existingView,
		] = await db.query(
			'SELECT * FROM qna_views WHERE post_id = ? AND device_id = ?',
			[id, deviceId]
		)

		if (existingView.length === 0) {
			await db.query(
				'INSERT INTO qna_views (post_id, device_id) VALUES (?, ?)',
				[id, deviceId]
			)
			await db.query('UPDATE qna_posts SET views = views + 1 WHERE id = ?', [
				id,
			])
		}

		const [posts] = await db.query('SELECT * FROM qna_posts WHERE id = ?', [id])
		if (posts.length === 0) {
			return res.status(404).json({ success: false, message: 'Post not found' })
		}

		// ✅ Fayllarni olish
		const [
			files,
		] = await db.query(
			'SELECT name, url, type FROM qna_files WHERE post_id = ?',
			[id]
		)
		posts[0].files = files

		res.status(200).json({ success: true, data: posts[0] })
	} catch (error) {
		console.error(error)
		res.status(500).json({ success: false, error: 'Server error' })
	}
}

// POST /api/qna/comment  - Postga komment qo‘shish
exports.createComment = async (req, res) => {
	try {
		const postId = req.params.id
		const { author, text } = req.body

		if (!postId || !author?.trim() || !text?.trim()) {
			return res.status(400).json({
				success: false,
				message: '필수 필드 누락됨 (postId, author, text).',
			})
		}

		await insertComment({
			post_id: Number(postId),
			author: author.trim(),
			text: text.trim(),
		})

		res.status(201).json({ success: true, message: 'Comment created' })
	} catch (error) {
		console.error('Create Comment Error:', error)
		res.status(500).json({ success: false, error: '서버 오류' })
	}
}

// GET /api/qna/:id/comments  - Postga tegishli kommentlarni olish
exports.getComments = async (req, res) => {
	try {
		const postId = Number(req.params.id)
		if (isNaN(postId)) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid post id' })
		}

		const comments = await getCommentsByPostId(postId)
		res.status(200).json({ success: true, data: comments })
	} catch (error) {
		console.error('Get Comments Error:', error.message)
		res.status(500).json({ success: false, error: '서버 오류' })
	}
}
