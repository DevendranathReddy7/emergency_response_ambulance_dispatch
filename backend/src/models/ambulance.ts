import mongoose, { Schema } from 'mongoose';
import { ambulanceStatus, ambulanceType } from '../common/constants';
 
const ambulances = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: [true, 'Vehicle number is required'],
        trim: true
    },
    ambulanceType: {
        type: String,
        enum: ambulanceType
    },
    status: {
        type: String,
        enum: ambulanceStatus,
        default: 'Available'
    },
},
{
    timestamps: true
})
 
 
export default mongoose.model('Ambulances', ambulances);