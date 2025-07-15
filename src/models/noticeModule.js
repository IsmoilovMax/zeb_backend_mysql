const pool = require('./db')

exports.getNoticePosts = async () => {
	const sql = `
		SELECT id, title, content, views, created_at
		FROM notice_posts
		ORDER BY created_at DESC
	`
	const [rows] = await pool.query(sql)
	return rows
}

exports.insertComment = async ({ post_id, author, text }) => {
	const sql = `
		INSERT INTO notice_comments (post_id, author, text)
		VALUES (?, ?, ?)
	`
	const [result] = await pool.query(sql, [post_id, author, text])
	return result
}

exports.getCommentsByPostId = async postId => {
	const sql = `
		SELECT id, author, text, created_at
		FROM notice_comments
		WHERE post_id = ?
		ORDER BY created_at ASC
	`
	const [rows] = await pool.query(sql, [postId])
	return rows
}

exports.insertNoticeFiles = async (postId, files) => {
	const sql = `
		INSERT INTO notice_files (post_id, name, url, type)
		VALUES ?
	`

	const values = files.map(f => [postId, f.name, f.url, f.type])
	const [result] = await pool.query(sql, [values])
	return result
}
