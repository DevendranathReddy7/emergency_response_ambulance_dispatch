const mongoose = require('mongoose')

const crewShiftSchema = new mongoose.Schema({
    crewName: {
        type: String,
        required: true
    },
    shiftStatus: {
        type: String,
        enum: ['active', 'resting', 'on-leave'],
        default: 'active'
    }
},{ timeStamp: true });

export default mongoose.model('CrewShift',crewShiftSchema)