const express = require('express')
const router = express.Router()
const { createQnaPost } = require('../controllers/qnaController')
const qnaController = require('../controllers/qnaController')

router.post('/', createQnaPost)
router.get('/', qnaController.getQnaPosts)
router.post('/:id', qnaController.deleteQnaPost)
router.get('/:id', qnaController.getQnaPostById)
router.post('/:id/comments', qnaController.createComment)
router.get('/comments/:id', qnaController.getComments)

module.exports = router
