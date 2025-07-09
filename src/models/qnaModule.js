const pool = require('./db')

exports.insertQnaPost = async post => {
	const { title, author, email, content, password, isPrivate } = post

	const sql = `
INSERT INTO qna_posts
(title, author, email, content, password, is_private)
VALUES (?, ?, ?, ?, ?, ?)

`

	const values = [
		title,
		author,
		email,
		content,
		password || null,
		isPrivate ? 1 : 0,
	]

	const [result] = await pool.query(sql, values)

	return result
}

exports.insertQnaFiles = async (postId, files) => {
	console.log('📂 Fayllar:', files)

	for (const file of files) {
		if (!file.name || !file.url || !file.type) {
			console.warn('⚠️ Noto‘g‘ri fayl maʼlumotlari:', file)
			continue
		}

		await pool.query(
			'INSERT INTO qna_files (post_id, name, url, type) VALUES (?, ?, ?, ?)',
			[postId, file.name, file.url, file.type]
		)
	}
}

exports.getQnaPosts = async () => {
	const sql = `
    SELECT id, title, author, email, content, password,views, is_private, created_at
    FROM qna_posts
    ORDER BY created_at DESC
  `
	const [rows] = await pool.query(sql)
	return rows
}

exports.insertComment = async ({ post_id, author, text }) => {
	const sql = `
    INSERT INTO qna_comments (post_id, author, text)
    VALUES (?, ?, ?)
  `
	const values = [post_id, author, text]
	const [result] = await pool.query(sql, values)
	return result
}

exports.getCommentsByPostId = async postId => {
	const sql = `
    SELECT id, author, text, created_at
    FROM qna_comments
    WHERE post_id = ?
    ORDER BY created_at ASC
  `
	const [rows] = await pool.query(sql, [postId])
	return rows
}
