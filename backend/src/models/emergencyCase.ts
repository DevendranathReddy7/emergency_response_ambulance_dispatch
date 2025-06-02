import mongoose, { Schema } from 'mongoose';
import { caseStatus, emergencyType } from '../common/constants';

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
        type: Number,
        required: [true, 'Priority level is required'],
        min: 1,
        max: 5,
    },
    status: {
        type: String,
        enum: caseStatus,
    },
    incidentDescription: String,
    ambulanceId: {
        type: Schema.Types.ObjectId,
        required: 'Ambulances',
    },
    crewMembers: [
        {
            staffId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
        }
    ],
},
    {
        timestamps: true
    })

export default mongoose.model('Cases', caseSchema);