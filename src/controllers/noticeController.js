const db = require('../models/db')
const {
	getNoticePosts,
	insertComment,
	getCommentsByPostId,
	insertNoticeFiles,
} = require('../models/noticeModule')

// POST /api/notices
exports.createNoticePost = async (req, res) => {
	try {
		const { title, content, files = [] } = req.body

		if (!title || !content) {
			return res.status(400).json({
				success: false,
				message: '필수 필드 누락됨 (title, content)',
			})
		}

		const [
			result,
		] = await db.query(
			'INSERT INTO notice_posts (title, content) VALUES (?, ?)',
			[title, content]
		)

		const postId = result.insertId

		if (files.length > 0) {
			const formattedFiles = Array.isArray(files) ? files : JSON.parse(files)
			await insertNoticeFiles(postId, formattedFiles)
		}

		res.status(201).json({
			success: true,
			message: 'Post created successfully',
			postId,
		})
	} catch (error) {
		console.error('Notice Create Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}

// GET /api/notices
exports.getNoticePosts = async (req, res) => {
	try {
		const posts = await getNoticePosts()
		res.status(200).json({
			success: true,
			data: posts,
		})
	} catch (error) {
		console.error('Notice Get All Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}

// GET /api/notices/:id
exports.getNoticePostById = async (req, res) => {
	try {
		const id = Number(req.params.id)
		const deviceId = req.headers['x-device-id']

		if (isNaN(id) || !deviceId) {
			return res.status(400).json({
				success: false,
				message: 'Invalid post ID or device ID',
			})
		}

		const [
			viewCheck,
		] = await db.query(
			'SELECT * FROM notice_views WHERE post_id = ? AND device_id = ?',
			[id, deviceId]
		)

		if (viewCheck.length === 0) {
			await db.query(
				'INSERT INTO notice_views (post_id, device_id) VALUES (?, ?)',
				[id, deviceId]
			)
			await db.query('UPDATE notice_posts SET views = views + 1 WHERE id = ?', [
				id,
			])
		}

		const [
			posts,
		] = await db.query(
			'SELECT id, title, content, views, created_at FROM notice_posts WHERE id = ?',
			[id]
		)

		if (posts.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			})
		}

		const [
			files,
		] = await db.query(
			'SELECT name, url, type FROM notice_files WHERE post_id = ?',
			[id]
		)

		posts[0].files = files

		res.status(200).json({
			success: true,
			data: posts[0],
		})
	} catch (error) {
		console.error('Get Notice Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}

// DELETE /api/notices/:id
exports.deleteNoticePost = async (req, res) => {
	try {
		const postId = Number(req.params.id)
		if (isNaN(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid post ID',
			})
		}

		await db.query('DELETE FROM notice_views WHERE post_id = ?', [postId])
		await db.query('DELETE FROM notice_comments WHERE post_id = ?', [postId])
		await db.query('DELETE FROM notice_files WHERE post_id = ?', [postId])

		const [result] = await db.query('DELETE FROM notice_posts WHERE id = ?', [
			postId,
		])
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			})
		}

		res.status(200).json({
			success: true,
			message: 'Post deleted successfully',
		})
	} catch (error) {
		console.error('Delete Notice Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}

// POST /api/notices/:id/comments
exports.createComment = async (req, res) => {
	try {
		const postId = Number(req.params.id)
		const { author, text } = req.body

		if (!postId || !author?.trim() || !text?.trim()) {
			return res.status(400).json({
				success: false,
				message: '필수 필드 누락됨 (postId, author, text)',
			})
		}

		await insertComment({
			post_id: postId,
			author: author.trim(),
			text: text.trim(),
		})

		res.status(201).json({
			success: true,
			message: 'Comment created',
		})
	} catch (error) {
		console.error('Create Comment Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}

// GET /api/notices/:id/comments
exports.getComments = async (req, res) => {
	try {
		const postId = Number(req.params.id)
		if (isNaN(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid post ID',
			})
		}

		const comments = await getCommentsByPostId(postId)
		res.status(200).json({
			success: true,
			data: comments,
		})
	} catch (error) {
		console.error('Get Comments Error:', error)
		res.status(500).json({
			success: false,
			message: 'Server error',
		})
	}
}
