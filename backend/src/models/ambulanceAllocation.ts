const mongoose = require('mongoose')
import crewShiftSchema from './crewShifts'

const ambAllocationSchema = new mongoose.Schema({
    ambulanceId: {
        type: String,
        required: true
    }, ambulanceType: {
        type: String,
        required: true,
        enum: ['Basic', 'ICU', 'Neonatal']
    }, status: {
        type: String,
        required: true,
        enum: ['Available', 'Not available'],
        default: 'Available'
    }, crewDetails: [crewShiftSchema]
})

export default ambAllocationSchema.model('AmbulanceAllocation', ambAllocationSchema)

