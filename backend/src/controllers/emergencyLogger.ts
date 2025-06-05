import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";
import { priorityLevel } from "../common/constants";
import ambulance from "../models/ambulance";

let crewEmail = ''

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

const updatePatientDetailsInUser = async (patientName: string, patientAge: string, patientMobile: string, patientGender: string, patientAddress: string, res: Response) => {
    try {
        const isPatientExisted = await user.findOne({ mobile: patientMobile, role: 'Patient' });

        if (isPatientExisted) {
            const patientUpdateFields: any = {};
            if (patientName) patientUpdateFields.name = patientName;
            if (patientAge) patientUpdateFields.age = patientAge;
            if (patientGender) patientUpdateFields.gender = patientGender;
            if (patientAddress) patientUpdateFields.address = patientAddress;

            if (Object.keys(patientUpdateFields).length > 0) {
                await user.findByIdAndUpdate(
                    isPatientExisted._id,
                    { $set: patientUpdateFields },
                    { new: true, runValidators: true }
                );
                console.log(`Patient with mobile ${patientMobile} updated successfully.`);
            }
        } else {
            console.log(`Patient with mobile ${patientMobile} not found for update.`);
        }
    } catch (error) {
        console.error(`Error updating patient with mobile ${patientMobile}:`, error);
    }
}

const validateFileds = (priority: string, ambulanceId: string, crewMembers: string[], res: Response) => {
    if (!priority || !priorityLevel.includes(priority)) {
        return res.status(400).json({ error: 'Priority is required and must be a value from 1 (Highest) to 5 (Lowest).' });
    }

    if (!ambulanceId) {
        return res.status(400).json({ error: 'Ambulance assignment is required for this case.' });
    }

    if (!crewMembers) {
        return res.status(400).json({ error: 'Please assign the staff members to this case.' });
    }
}

const resloveCrewIds = (crewMembers: string[]) => {
    const staffMongoIdPromises = crewMembers.map(async (staff: string) => {
        const parts = staff.split('-');
        crewEmail = parts[1]?.trim();
        if (crewEmail) {
            try {
                const userResult = await user.findOne({ email: crewEmail, role: { $ne: 'Patient' } }).select('_id'); // Select only the _id
                return userResult ? userResult._id : null;
            } catch (error) {
                console.error(`Error finding user with emailId ${crewEmail}:`, error);
                return null;
            }
        }
        return null;
    });

    return staffMongoIdPromises

}



export const emergencyLogger = async (req: Request, res: Response, next: NextFunction) => {
    const { emergencyType, incidentLocation, priority, ambulanceId, crewMembers, patientName, patientAge, patientMobile, patientGender, patientAddress, caseStatus } = req.body;

    if (patientMobile) {
        await addPatientDetailsToUser(patientName, patientAge, patientMobile, patientGender, patientAddress, res)
    }


    const resolvedStaffMongoIds = (await Promise.all(resloveCrewIds(crewMembers))).filter(id => id !== null);

    try {
        validateFileds(priority, ambulanceId, crewMembers, res)

        const ambulanceMongoId = await ambulance.findOne({ vehicleNumber: ambulanceId.split('--')[0].trim() }).select('_id');
        const patientId = await user.findOne({ mobile: patientMobile, role: 'Patient' }).select('_id')
        const crewMember = await user.findOne({ email: crewEmail, role: { $ne: 'Patient' } })

        const newCase = new emergencyCase({
            ...req.body,
            emergencyType,
            incidentLocation,
            patientDetails: patientId,
            status: caseStatus,
            ambulanceId: ambulanceMongoId,
            crewMembers: resolvedStaffMongoIds
        });
        const savedCase = await newCase.save();

        if (savedCase) {
            const updateAmbulanceStatus = await ambulance.findByIdAndUpdate(
                ambulanceMongoId,
                { status: 'Not Available' },
                { new: true }
            );

            if (updateAmbulanceStatus) {
                console.log('Ambulance status updated successfully:', updateAmbulanceStatus);
            } else {
                console.warn('Ambulance not found or not updated for ID:', ambulanceMongoId);
            }

            if (crewMember) {
                const newFatigueLevel = Math.max(0, crewMember.fatigueLevel - 1);

                const updatedCrewMember = await user.findByIdAndUpdate(
                    crewMember._id,
                    { fatigueLevel: newFatigueLevel },
                    { new: true, runValidators: true }
                );

                if (updatedCrewMember) {
                    console.log('Fatigue Level is updated:', updatedCrewMember);
                } else {
                    console.warn('Failed to update the fatigue level');
                }
            }


        }

        res.status(201).json({ message: 'Case Logged Successfully', data: newCase.crewMembers });

    } catch (e: any) {
        res.status(500).json({ message: 'Failed to log emergency case due to a server error.', error: e.message });
    }
}


export const updateEmergency = async (req: Request, res: Response, next: NextFunction) => {
    const { emergencyType, incidentLocation, priority, ambulanceId, crewMembers, patientName, patientAge, patientMobile, patientGender, patientAddress, caseStatus, editingDocId } = req.body;

    if (patientMobile) {
        await updatePatientDetailsInUser(patientName, patientAge, patientMobile, patientGender, patientAddress, res)
    }

    const resolvedStaffMongoIds = (await Promise.all(resloveCrewIds(crewMembers))).filter(id => id !== null);

    try {
        validateFileds(priority, ambulanceId, crewMembers, res)
        const ambulanceMongoId = await ambulance.findOne({ vehicleNumber: ambulanceId.split('--')[0].trim() }).select('_id');
        const patientId = await user.findOne({ mobile: patientMobile, role: 'Patient' }).select('_id')

        const updatedCase = await emergencyCase.findByIdAndUpdate(editingDocId, {
            emergencyType,
            incidentLocation,
            status: caseStatus,
            patientDetails: patientId,
            crewMembers: resolvedStaffMongoIds,
            ambulanceId: ambulanceMongoId,

        })
        res.status(200).json({ message: 'Updated the case details', data: updatedCase })

    } catch (e: any) {
        res.status(500).json({ message: 'Failed to update emergency case due to a server error.', error: e.message });
    }
}