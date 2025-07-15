const express = require('express')
const router = express.Router()
const db = require('../models/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// 🔐 Registration
router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body
		if (!username || !password) {
			return res.status(400).json({ message: 'All fields are required' })
		}

		const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [
			username,
		])
		if (rows.length > 0) {
			return res.status(400).json({ message: 'Username already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [
			username,
			hashedPassword,
		])

		return res.status(201).json({ message: 'User registered successfully' })
	} catch (err) {
		console.error('❌ Register error:', err)
		return res.status(500).json({ error: 'Server error' })
	}
})

// 🔑 Login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body
		if (!username || !password) {
			return res.status(400).json({ message: 'All fields are required' })
		}

		const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [
			username,
		])
		if (rows.length === 0) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const user = rows[0]
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		return res.json({ message: 'Login successful', token })
	} catch (err) {
		console.error('❌ Login error:', err)
		return res.status(500).json({ error: 'Server error' })
	}
})

module.exports = router
