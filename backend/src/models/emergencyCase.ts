const mongoose = require('mongoose')

const caseSchema = new mongoose.Schema({
    patientName: {
        type: String
    }
})

export default mongoose.model('Books', caseSchema)
