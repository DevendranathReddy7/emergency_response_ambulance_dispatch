import { NextFunction, Request, Response } from "express";
import user from "../models/user";
import { roles, staffRoles } from "../common/constants";
import mongoose from "mongoose";

export interface CrewQueryParams {
    role?: string;
    status?: string;
}

export const addStaff = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, role, mobile } = req.body;

    try {
        if (!email && staffRoles.includes(role)) {
            return res.status(400).json({ error: 'Please enter the email' });
        }

        const isEmailExisted = await user.findOne({ email });
        const isMobileExisted = await user.findOne({ mobile });
        if (isEmailExisted) {
            return res.status(400).json({ error: 'Entered email is already present' });
        }
        if (email.includes('-')) {
            return res.status(400).json({ error: 'Please remove hypens\'s (-) from the emailId' });
        }
        if (isMobileExisted) {
            return res.status(400).json({ error: 'Entered mobile number is already present' });

        }

        if (name.length < 3) {
            return res.status(400).json({ error: 'Name should contains atleast 3 character length' });
        }

        if (!roles.includes(role)) {
            return res.status(400).json({ error: 'Role can be only one of Admin, Emergency response staff, Triage staff, Patient' });
        }

        if (!mobile) {
            return res.status(400).json({ error: 'Staff mobile number is required' });
        }

        const newUserObject = await new user({
            ...req.body
        })

        if (!staffRoles.includes(role)) {
            newUserObject.password = name.slice(0, 4) + Math.floor(Math.random() * 1000)
        }

        await newUserObject.save();
        res.status(201).json({ message: 'Staff added successfully', data: newUserObject?.password });
    } catch (e: any) {
        res.status(500).json({ message: 'Failed to add the memeber due to a server error. Please try again later', error: e.message });
    }
};
 
export const getCrewMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, status } = req.query as CrewQueryParams;

        let query: any = {};

        if (typeof role === 'string' && role.toLowerCase() !== 'all') {

            if (role === 'erStaff') {
                query.role = 'Emergency response staff'
            } else if (role === 'trStaff') {
                query.role = 'Triage staff'
            } else if (role === 'admin') {
                query.role = 'Admin'
            } else {
                return res.status(400).json({ message: `Invalid role specified: ${role}.` });
            }
        }

        if (typeof status === 'string' && status.toLowerCase() === 'active') {
            query.status = "Active";
        } else if (typeof status === 'string' && status.toLowerCase() === 'inactive') {
            query.status = "Inactive";
        }


        const crewMembers = await user.find(query);

        res.status(200).json({ data: crewMembers });
    } catch (e: any) {
        console.error('Failed to retrieve crew members:', e.message);
        res.status(500).json({ message: 'Failed to retrieve crew members. Please try again later', error: e.message });
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