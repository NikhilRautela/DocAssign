const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const prisma = new PrismaClient()

router.get('/reports', auth(['DOCTOR']), async (req, res) => {
  const doctor = await prisma.doctorProfile.findUnique({ where: { userId: req.user.id } })
  const assignments = await prisma.doctorAssignment.findMany({
    where: { doctorProfileId: doctor.id },
    include: { report: { include: { aiAnalysis: true, patientProfile: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(assignments)
})

router.patch('/reports/:id/mark-reviewed', auth(['DOCTOR']), async (req, res) => {
  await prisma.doctorAssignment.update({
    where: { reportId: req.params.id },
    data: { status: 'REVIEWED', reviewedAt: new Date() }
  })
  await prisma.patientReport.update({ where: { id: req.params.id }, data: { status: 'REVIEWED' } })
  res.json({ success: true })
})

module.exports = router