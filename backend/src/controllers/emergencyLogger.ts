import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";
import { priorityLevel } from "../common/constants";
import ambulance from "../models/ambulance";

const addPatientDetailsToUser = async (patientName: string, patientAge: string, patientMobile: string, patientGender: string, patientAddress: string, res: Response) => {
    const isPatientExisted = await user.findOne({ mobile: patientMobile, role: 'Patient' });
    if (!isPatientExisted) {
        try {
            const addPatient = new user({
                name: patientName,
                age: patientAge,
                mobile: patientMobile,
                gender: patientGender,
                address: patientAddress,
                role: 'Patient'
            })

            await addPatient.save()
            console.log('Patient added successfully (from addPatientDetailsToUser)');
        } catch (e: any) {
            console.error('Failed to add Patient (from addPatientDetailsToUser):', e.message);
        }
    } else {
        console.log('Patient already exists (from addPatientDetailsToUser)');
    }

}

const emergencyLogger = async (req: Request, res: Response, next: NextFunction) => {
    const { emergencyType, incidentLocation, priority, ambulanceId, crewMembers, patientName, patientAge, patientMobile, patientGender, patientAddress, caseStatus } = req.body;

    await addPatientDetailsToUser(patientName, patientAge, patientMobile, patientGender, patientAddress, res)

    const staffMongoIdPromises = crewMembers.map(async (staff: string) => {
        const parts = staff.split('-');
        const email = parts[1]?.trim();
        if (email) {
            try {
                const userResult = await user.findOne({ email, role: { $ne: 'Patient' } }).select('_id'); // Select only the _id
                return userResult ? userResult._id : null;
            } catch (error) {
                console.error(`Error finding user with emailId ${email}:`, error);
                return null;
            }
        }
        return null;
    });

    const resolvedStaffMongoIds = (await Promise.all(staffMongoIdPromises)).filter(id => id !== null);


    try {
        if (!priority || !priorityLevel.includes(priority)) {
            return res.status(400).json({ error: 'Priority is required and must be a value from 1 (Highest) to 5 (Lowest).' });
        }

        if (!ambulanceId) {
            return res.status(400).json({ error: 'Ambulance assignment is required for this case.' });
        }

        if (!crewMembers) {
            return res.status(400).json({ error: 'Please assign the staff members to this case.' });
        }

        const ambulanceMongoId = await ambulance.findOne({ vehicleNumber: ambulanceId.split('--')[0].trim() }).select('_id');
        const patientId = await user.findOne({ mobile: patientMobile, role: 'Patient' }).select('_id')

        const newCase = new emergencyCase({
            //@ts-ignore
            ...req.body,
            emergencyType,
            incidentLocation,
            patientDetails: patientId,
            status: caseStatus,
            ambulanceId: ambulanceMongoId,
            crewMembers: resolvedStaffMongoIds
        });
        console.log(newCase, '---------------<>=======')
        await newCase.save();
        res.status(201).json({ message: 'Case Logged Successfully', data: newCase.crewMembers });

    } catch (e: any) {
        res.status(500).json({ message: 'Failed to log emergency case due to a server error.', error: e.message });
    }
}

export default emergencyLogger;