import mongoose from "mongoose";
import { roles } from "../common/constants";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        unique: true,
        index: true,
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
        required: false
    },
}, {
    timestamps: true
})

export default mongoose.model("User", userSchema);