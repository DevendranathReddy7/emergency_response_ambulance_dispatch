import { NextFunction, Request, Response } from "express";
import user from "../models/user";
import { roles, staffRoles } from "../common/constants";
import mongoose from "mongoose";
const bcrypt = require('bcryptjs');

export interface CrewQueryParams {
    role?: string;
    status?: string;
}


const validateUIFields = (email: string, name: string, role: string, mobile: string): string | null => {
    if (!name || name.length < 3) {
        return 'Name should contain at least 3 characters.';
    }

    if (!roles.includes(role)) {
        return 'Role can only be one of Admin, Emergency response staff, Triage staff, Patient.';
    }

    if (!mobile) {
        return 'Mobile number is required.';
    }
    if (mobile.length < 10 || !/^\d+$/.test(mobile)) {
        return 'Mobile number must be at least 10 digits and contain only numbers.';
    }

    if (staffRoles.includes(role)) {
        if (!email) {
            return 'Email is required for staff roles.';
        }
        if (email.includes('-')) {
            return 'Please remove hyphens (-) from the email ID.';
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return 'Please enter a valid email format.';
        }
    }

    return null;
};


export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, role, mobile } = req.body;

    try {
        const validationError = validateUIFields(email, name, role, mobile);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const isEmailExisted = await user.findOne({ email });
        if (isEmailExisted) {
            return res.status(400).json({ error: 'Entered email is already registered.' });
        }

        const isMobileExisted = await user.findOne({ mobile });
        if (isMobileExisted) {
            return res.status(400).json({ error: 'Entered mobile number is already registered.' });
        }

        const newUserObject = new user({
            ...req.body
        });

        const tempPassword = name.slice(0, 4) + Math.floor(Math.random() * 1000);

        if (staffRoles.includes(role)) {
            newUserObject.password = await bcrypt.hash(tempPassword, 10)
        }

        const savedUser = await newUserObject.save();


        res.status(201).json({ message: 'Staff added successfully', data: { userId: savedUser._id, email: email, generatedPassword: tempPassword } });

    } catch (e: any) {
        console.error('Failed to add the member due to a server error:', e.message);
        res.status(500).json({ message: 'Failed to add the member due to a server error. Please try again later.', error: e.message });
    }
};

export const getCrewMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, status } = req.query as CrewQueryParams;

        let query: any = {};
        if (typeof role === 'string' && role.toLowerCase() !== 'all') {
            switch (role.toLowerCase()) {
                case 'erstaff':
                    query.role = 'Emergency response staff';
                    break;
                case 'trstaff':
                    query.role = 'Triage staff';
                    break;
                case 'admin':
                    query.role = 'Admin';
                    break;
                case 'patient':
                    query.role = 'Patient';
                    break;
                default:
                    return res.status(400).json({ message: `Invalid role specified: "${role}". Allowed roles are: erStaff, trStaff, admin, patient, all.` });
            }
        }

        if (typeof status === 'string') {
            const lowerCaseStatus = status.toLowerCase();
            if (lowerCaseStatus === 'active' || lowerCaseStatus === 'inactive') {
                query.status = status;
            } else if (lowerCaseStatus !== 'all') {
                return res.status(400).json({ message: `Invalid status specified: "${status}". Allowed statuses are: Active, Inactive, all.` });
            }
        }

        const crewMembers = await user.find(query).sort({ name: 1 });

        res.status(200).json({ data: crewMembers });
    } catch (e: any) {
        console.error('Failed to retrieve crew members:', e.message);
        res.status(500).json({ message: 'Failed to retrieve crew members. Please try again later.', error: e.message });
    }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'Staff ID is required for deletion.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId as string)) {
            return res.status(400).json({ message: 'Invalid Staff ID format.' });
        }

        const deletedUser = await user.findByIdAndDelete(userId as string);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Staff member not found.' });
        }

        res.status(200).json({ message: 'Staff member deleted successfully.', deletedUserId: deletedUser._id });

    } catch (e: any) {
        console.error('Error deleting staff member:', e);
        res.status(500).json({ message: 'Failed to delete staff member. Please try again later.', error: e.message });
    }
};


export const editStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, role, mobile, editingUserId } = req.body;

    try {
        const validationError = validateUIFields(email, name, role, mobile);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        if (!editingUserId || !mongoose.Types.ObjectId.isValid(editingUserId as string)) {
            return res.status(400).json({ message: 'Invalid or missing user ID for update.' });
        }

        const existingUser = await user.findById(editingUserId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found for update.' });
        }


        if (staffRoles.includes(role) && email && email !== existingUser.email) {
            const isEmailTaken = await user.findOne({ email });
            if (isEmailTaken) {
                return res.status(400).json({ error: 'This email is already taken by another user.' });
            }
        }

        if (mobile && mobile !== existingUser.mobile) {
            const isMobileTaken = await user.findOne({ mobile });
            if (isMobileTaken) {
                return res.status(400).json({ error: 'This mobile number is already taken by another user.' });
            }
        }

        const updateFields: any = {
            ...req.body,
            ...(staffRoles.includes(role) && email && { email }),
        };


        const updatedUser = await user.findByIdAndUpdate(
            editingUserId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ message: 'Failed to update user due to an internal error.' });
        }

        res.status(200).json({ message: 'Staff updated successfully', data: updatedUser });

    } catch (e: any) {
        console.error('Failed to update the member due to a server error:', e.message);
        res.status(500).json({ message: 'Failed to update the member due to a server error. Please try again later.', error: e.message });
    }
};