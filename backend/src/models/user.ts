import mongoose from "mongoose";
import { gender, roles, shiftType } from "../common/constants";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    role: {
        type: String,
        enum: roles,
        required: [true, 'Role is required'],
    },
    password: String,
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    fatigueLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
    },
    shiftType: {
        type: String,
        enum: shiftType,
    },
    shiftStartTime: {
        type: Date,
    },
    shiftEndTime: {
        type: Date,
    },
    age:{
        type: String,
    },
    gender: {
        type: String,
        enum: gender
    },
    mobile: {
        type: String,
        unique:true
    },
    address: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } });

export default mongoose.model("User", userSchema);