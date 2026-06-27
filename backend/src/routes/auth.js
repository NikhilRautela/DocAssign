const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, age, gender, phone, category, specialization, experience } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email, password: hashed, role: role || 'PATIENT',
        ...(role === 'DOCTOR' ? {
          doctorProfile: { create: { name, category, specialization, experience: parseInt(experience), available: true } }
        } : role === 'ADMIN' ? {} : {
          patientProfile: { create: { name, age: parseInt(age), gender, phone } }
        })
      },
      include: { patientProfile: true, doctorProfile: true }
    })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Email already registered. Please use a different email.' })
    }
    res.status(400).json({ error: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { patientProfile: true, doctorProfile: true }
    })
    if (!user || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, patientProfile: user.patientProfile, doctorProfile: user.doctorProfile } })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/me', require('../middleware/auth')(), async (req, res) => {
  const user = await prisma.user.findUnique({ 
    where: { id: req.user.id },
    include: { patientProfile: true, doctorProfile: true }
  })
  res.json(user)
})

module.exports = router