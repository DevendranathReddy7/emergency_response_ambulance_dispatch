import mongoose, { Schema } from 'mongoose';
import emergencyCase from './emergencyCase';
 
const notficationsSchema = new mongoose.Schema({
    caseId: {
        type: Schema.Types.ObjectId,
        ref: emergencyCase
    },
    message: {type: String}
}, {
    timestamps: true
})
 
export default mongoose.model('Notifications', notficationsSchema);