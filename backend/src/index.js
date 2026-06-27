const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/doctors', require('./routes/doctors'))
app.use('/api/reports', require('./routes/reports'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/doctor', require('./routes/doctorRoutes'))

app.get('/', (req, res) => res.json({ message: 'DocAssign API Running!' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))