import express from 'express'
import {
	addComment,
	getAllQuestions,
	getSingleQuestion,
	incrementView,
	submitQuestion,
} from '../controllers/qnaController.js'

const router = express.Router()

router.post('/', submitQuestion)
router.get('/', getAllQuestions)
router.post('/:id/comment', addComment)
router.post('/:id', getSingleQuestion)
router.patch('/:id/view', incrementView)

export default router
