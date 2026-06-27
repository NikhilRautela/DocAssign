const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const prisma = new PrismaClient()

router.get('/', auth(), async (req, res) => {
  const doctors = await prisma.doctorProfile.findMany({ where: { available: true } })
  res.json(doctors)
})

router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const { name, category, specialization, experience, email, password } = req.body
    const bcrypt = require('bcryptjs')
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email, password: hashed, role: 'DOCTOR',
        doctorProfile: { create: { name, category, specialization, experience: parseInt(experience) } }
      },
      include: { doctorProfile: true }
    })
    res.json(user.doctorProfile)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.patch('/:id', auth(['ADMIN']), async (req, res) => {
  const doctor = await prisma.doctorProfile.update({
    where: { id: req.params.id },
    data: req.body
  })
  res.json(doctor)
})

module.exports = router