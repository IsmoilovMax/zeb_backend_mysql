const express = require('express')
const router = express.Router()
const {
	createNoticePost,
	createComment,
	deleteNoticePost,
	getComments,
	getNoticePostById,
	getNoticePosts,
} = require('../controllers/noticeController')

router.post('/', createNoticePost)
router.get('/', getNoticePosts)
router.post('/:id', deleteNoticePost)
router.get('/:id', getNoticePostById)
router.post('/:id/comments', createComment)
router.get('/comments/:id', getComments)

module.exports = router
