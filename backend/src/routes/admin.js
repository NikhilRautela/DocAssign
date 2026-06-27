const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const prisma = new PrismaClient()

router.get('/reports', auth(['ADMIN']), async (req, res) => {
  const reports = await prisma.patientReport.findMany({
    include: { aiAnalysis: true, assignment: { include: { doctor: true } }, patientProfile: true },
    orderBy: { createdAt: 'desc' }
  })
  res.json(reports)
})

router.patch('/reports/:id/assign-doctor', auth(['ADMIN']), async (req, res) => {
  const { doctorProfileId } = req.body
  const existing = await prisma.doctorAssignment.findUnique({ where: { reportId: req.params.id } })
  if (existing) {
    await prisma.doctorAssignment.update({
      where: { reportId: req.params.id },
      data: { doctorProfileId, status: 'ASSIGNED' }
    })
  } else {
    await prisma.doctorAssignment.create({
      data: { reportId: req.params.id, doctorProfileId, status: 'ASSIGNED' }
    })
  }
  await prisma.patientReport.update({ where: { id: req.params.id }, data: { status: 'ASSIGNED' } })
  res.json({ success: true })
})

router.get('/patients', auth(['ADMIN']), async (req, res) => {
  const patients = await prisma.patientProfile.findMany({ include: { user: true } })
  res.json(patients)
})

module.exports = router