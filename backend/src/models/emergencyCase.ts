const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
    patientName: { type: String },
    patientAge: { type: String },
    patientGender: { type: String, enum: ['Male', 'Female'] },
    location: { type: String },
    emergencyType: { type: String, enum: ['Accident', 'Cardiac', 'trauma'] },
    priority: { type: String, enum: ['1', '2', '3', '4', '5'] }
})

export default mongoose.model('Books', caseSchema)
