import mongoose, { Schema } from 'mongoose';
import { caseStatus, emergencyType, priorityLevel } from '../common/constants';

const caseSchema = new mongoose.Schema({
    patientDetails: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    incidentLocation: String,
    emergencyType: {
        type: String,
        required: [true, 'Emergency type is required'],
        enum: emergencyType
    },
    priority: {
        type: String,
        required: [true, 'Priority level is required'],
        enum: priorityLevel
    },
    status: {
        type: String,
        enum: caseStatus,
    },
    incidentDescription: String,
    ambulanceId: {
        type: Schema.Types.ObjectId,
        ref: 'Ambulances',
    },
    crewMembers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true
    })

export default mongoose.model('Cases', caseSchema);