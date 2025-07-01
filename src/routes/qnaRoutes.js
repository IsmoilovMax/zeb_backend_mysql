const express = require('express')
const {
	addComment,
	getAllQuestions,
	getSingleQuestion,
	incrementView,
	submitQuestion,
} = require('../controllers/qnaController')

const router = express.Router()

router.post('/', submitQuestion)
router.get('/', getAllQuestions)
router.post('/:id/comment', addComment)
router.post('/:id', getSingleQuestion)
router.patch('/:id/view', incrementView)

module.exports = router
