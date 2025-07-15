const express = require('express')
const router = express.Router()
const {
	createComment,
	createQnaPost,
	deleteQnaPost,
	getComments,
	getQnaPostById,
	getQnaPosts,
} = require('../controllers/qnaController')

router.post('/', createQnaPost)
router.get('/', getQnaPosts)
router.post('/:id', deleteQnaPost)
router.get('/:id', getQnaPostById)
router.post('/:id/comments', createComment)
router.get('/comments/:id', getComments)

module.exports = router
