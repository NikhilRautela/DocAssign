const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const { analyzeTranscript } = require('../services/aiService')
const prisma = new PrismaClient()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/upload', auth(['PATIENT']), upload.single('report'), async (req, res) => {
  try {
    const { symptoms, manualTranscript } = req.body
    const patient = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } })
    
    let transcript = manualTranscript || symptoms || ''
    
    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase()
      if (ext === '.pdf') {
        try {
          const pdfParse = require('pdf-parse')
          const buffer = fs.readFileSync(req.file.path)
          const data = await pdfParse(buffer)
          transcript = data.text || transcript
        } catch {}
      }
    }

    const report = await prisma.patientReport.create({
      data: {
        patientProfileId: patient.id,
        symptoms,
        filePath: req.file ? req.file.path : null,
        transcript,
        status: 'PENDING'
      }
    })

    // Auto analyze
    const analysis = await analyzeTranscript(transcript)
    await prisma.aIAnalysisLog.create({
      data: {
        reportId: report.id,
        transcript,
        suggestedCategory: analysis.suggestedCategory,
        confidence: analysis.confidence,
        urgency: analysis.urgency,
        reason: analysis.reason,
        keywords: JSON.stringify(analysis.keywords),
        source: analysis.source
      }
    })

    // Auto assign doctor
    const doctor = await prisma.doctorProfile.findFirst({
      where: { category: analysis.suggestedCategory, available: true }
    })
    if (doctor) {
      await prisma.doctorAssignment.create({
        data: { reportId: report.id, doctorProfileId: doctor.id, status: 'ASSIGNED' }
      })
      await prisma.patientReport.update({ where: { id: report.id }, data: { status: 'ASSIGNED' } })
    }

    res.json({ report, analysis })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.get('/my', auth(['PATIENT']), async (req, res) => {
  const patient = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } })
  const reports = await prisma.patientReport.findMany({
    where: { patientProfileId: patient.id },
    include: { aiAnalysis: true, assignment: { include: { doctor: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(reports)
})

router.get('/:id', auth(), async (req, res) => {
  const report = await prisma.patientReport.findUnique({
    where: { id: req.params.id },
    include: { aiAnalysis: true, assignment: { include: { doctor: true } }, patientProfile: true }
  })
  res.json(report)
})

module.exports = router