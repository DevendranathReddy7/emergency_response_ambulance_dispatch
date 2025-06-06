import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";
import { priorityLevel } from "../common/constants";
import ambulance from "../models/ambulance";
import mongoose from "mongoose";


const addPatientDetailsToUser = async (patientName: string, patientAge: string, patientMobile: string, patientGender: string, patientAddress: string) => {
    try {
        const isPatientExisted = await user.findOne({ mobile: patientMobile, role: 'Patient' });
        if (!isPatientExisted) {
            const addPatient = new user({
                name: patientName,
                age: patientAge,
                mobile: patientMobile,
                gender: patientGender,
                address: patientAddress,
                role: 'Patient'
            });
            await addPatient.save();
            console.log('Patient added successfully (from addPatientDetailsToUser)');
            //return true; 
        } else {
            console.log('Patient already exists (from addPatientDetailsToUser)');
            //return true; 
        }
    } catch (e: any) {
        console.error('Failed to add Patient (from addPatientDetailsToUser):', e.message);
        //return false;
    }
};

const updatePatientDetailsInUser = async (patientName: string, patientAge: string, patientMobile: string, patientGender: string, patientAddress: string) => {
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
            //return true;
        } else {
            addPatientDetailsToUser(patientName, patientAge, patientMobile, patientGender, patientAddress)
            //console.log(`Patient with mobile ${patientMobile} not found for update.`);
            //return false; // Or true, depending on if you consider "not found" an error in update context
        }
    } catch (error) {
        console.error(`Error updating patient with mobile ${patientMobile}:`, error);
        //return false;
    }
};

const validateFileds = (priority: string, ambulanceId: string, crewMembers: string[]) => {
    if (!priority || !priorityLevel.includes(priority)) {
        return 'Priority is required and must be a value from 1 (Highest) to 5 (Lowest).';
    }

    if (!ambulanceId) {
        return 'Ambulance assignment is required for this case.';
    }

    if (!crewMembers || crewMembers.length === 0) {
        return 'Please assign the staff members to this case.';
    }
    return null;
};

const resloveCrewIds = (crewMembers: string[]) => {
    const staffMongoIdPromises = crewMembers.map(async (staff: string) => {
        const parts = staff.split('-');
        const email = parts[1]?.trim();
        if (email) {
            try {
                const userResult = await user.findOne({ email: email, role: { $ne: 'Patient' } }).select('_id');
                return userResult ? userResult._id : null;
            } catch (error) {
                console.error(`Error finding user with emailId ${email}:`, error);
                return null;
            }
        }
        return null;
    });
    return staffMongoIdPromises;
};

export const emergencyLogger = async (req: Request, res: Response, next: NextFunction) => {
    const { emergencyType, incidentLocation, priority, ambulanceId, crewMembers, patientName, patientAge, patientMobile, patientGender, patientAddress, caseStatus } = req.body;

    const validationError = validateFileds(priority, ambulanceId, crewMembers);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        if (patientMobile) {
            const patientAddSuccess = await addPatientDetailsToUser(patientName, patientAge, patientMobile, patientGender, patientAddress);

            // if (!patientAddSuccess) {
            //     return res.status(500).json({ message: 'Failed to add or verify patient details.' });
            // }
        }
         const patientDoc = await user.findOne({ mobile: patientMobile, role: 'Patient' }).select('_id');
        // if (!patientDoc) {
        //     // This might happen if addPatientDetailsToUser failed silently or mobile didn't match.
        //     return res.status(404).json({ message: 'Patient record not found to link with case.' });
        // }


        const resolvedStaffMongoIds = (await Promise.all(resloveCrewIds(crewMembers))).filter(id => id !== null);

        const ambulanceMongoDoc = await ambulance.findOne({ vehicleNumber: ambulanceId.split('--')[0].trim() }).select('_id');
        if (!ambulanceMongoDoc) {
            return res.status(404).json({ message: 'Assigned ambulance not found.' });
        }


        const crewMembersToUpdate: { id: mongoose.Types.ObjectId; newFatigueLevel: number; }[] = [];
        
        for (const crewId of resolvedStaffMongoIds) {
            const crewMemberDoc = await user.findById(crewId);
            if (!crewMemberDoc) {
                return res.status(404).json({ message: `Crew member with ID ${crewId} not found during fatigue check.` });
            }

            const newFatigueLevel = Math.max(0, crewMemberDoc.fatigueLevel - 1);

            if (newFatigueLevel < 1) { 
                return res.status(400).json({
                    message: `Incident couldn't be logged. Crew member "${crewMemberDoc.name}" has a fatigue level of 1. Reducing it further is not allowed.`,
                    error: `Validation failed: fatigueLevel: Path \`fatigueLevel\` (${newFatigueLevel}) is less than minimum allowed value (1).`
                });
            }
            crewMembersToUpdate.push({ id: crewId, newFatigueLevel: newFatigueLevel });
        }

        const newCase = new emergencyCase({
            emergencyType,
            incidentLocation,
            priority,
            status: caseStatus,
            patientDetails: patientDoc?._id,
            ambulanceId: ambulanceMongoDoc._id,
            crewMembers: resolvedStaffMongoIds
        });
        const savedCase = await newCase.save();

        if (savedCase) {

            for (const crewId of resolvedStaffMongoIds) {
            const crewMemberDoc = await user.findById(crewId);
            if (crewMemberDoc) {
                const newFatigueLevel = Math.max(0, crewMemberDoc.fatigueLevel - 1);
                const updatedCrewMember = await user.findByIdAndUpdate(
                    crewId,
                    { fatigueLevel: newFatigueLevel },
                    { new: true, runValidators: true }
                );
                if (updatedCrewMember) {
                    console.log(`Fatigue Level updated for crew member ${crewId}:`, updatedCrewMember.fatigueLevel);
                } else {
                    console.warn(`Failed to update fatigue level for crew member ${crewId}`);
                }
            }
        }

            const updateAmbulanceStatus = await ambulance.findByIdAndUpdate(
                ambulanceMongoDoc._id,
                { status: 'Not Available' },
                { new: true }
            );

            if (updateAmbulanceStatus) {
                console.log('Ambulance status updated successfully:', updateAmbulanceStatus);
            } else {
                console.warn('Ambulance not found or not updated for ID:', ambulanceMongoDoc._id);
            }
        }

        res.status(201).json({ message: 'Case Logged Successfully', data: savedCase });

    } catch (e: any) {
        console.error('Failed to log emergency case due to a server error:', e);
        res.status(500).json({ message: 'Failed to log emergency case due to a server error.', error: e.message });
    }
};


export const updateEmergency = async (req: Request, res: Response, next: NextFunction) => {
    const { emergencyType, incidentLocation, priority, ambulanceId, crewMembers, patientName, patientAge, patientMobile, patientGender, patientAddress, caseStatus, editingDocId } = req.body;

    const validationError = validateFileds(priority, ambulanceId, crewMembers);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        if (patientMobile) {
            const patientUpdateSuccess = await updatePatientDetailsInUser(patientName, patientAge, patientMobile, patientGender, patientAddress);
            // if (!patientUpdateSuccess) {
            //      console.warn('Could not update patient details, proceeding with case update.');
            // }
        }

        const resolvedStaffMongoIds = (await Promise.all(resloveCrewIds(crewMembers))).filter(id => id !== null);

        const existingCase = await emergencyCase.findById(editingDocId);
        if (!existingCase) {
            return res.status(404).json({ message: 'Emergency case not found for update.' });
        }

        const newAmbulanceMongoDoc = await ambulance.findOne({ vehicleNumber: ambulanceId.split('--')[0].trim() }).select('_id');
        if (!newAmbulanceMongoDoc) {
            return res.status(404).json({ message: 'New assigned ambulance not found.' });
        }
        const newAmbulanceMongoId = newAmbulanceMongoDoc._id;

        const patientDoc = await user.findOne({ mobile: patientMobile, role: 'Patient' }).select('_id');
        if (!patientDoc) {
            //return res.status(404).json({ message: 'Patient record not found to link with case.' });
            console.warn('Patient record not found to link with case.')
        }
        const patientId = patientDoc?._id;


        // Perform the case update
        const updatedCase = await emergencyCase.findByIdAndUpdate(editingDocId, {
            emergencyType,
            incidentLocation,
            status: caseStatus,
            patientDetails: patientId,
            crewMembers: resolvedStaffMongoIds,
            ambulanceId: newAmbulanceMongoId, // Use the new resolved ID
            priority, // Ensure priority is included in the update
        }, { new: true, runValidators: true });

        if (!updatedCase) {
            // This should ideally not happen if existingCase check passed, but as a safeguard.
            return res.status(500).json({ message: 'Failed to update emergency case.' });
        }

        if (updatedCase && ['At Hospital', 'Closed'.includes(caseStatus)]) {
            await ambulance.findByIdAndUpdate(
                existingCase.ambulanceId,
                { status: 'Available' },
                { new: false }
            );
        }


        //Start --Below code is when we need have an option to change ambulance in Edit
        // if (existingCase.ambulanceId && !existingCase.ambulanceId.equals(newAmbulanceMongoId)) {
        //     await ambulance.findByIdAndUpdate(
        //         existingCase.ambulanceId,
        //         { status: 'Available' },
        //         { new: false }
        //     );
        //     console.log(`Old ambulance (ID: ${existingCase.ambulanceId}) status reverted to 'Available'.`);
        // }


        // await ambulance.findByIdAndUpdate(
        //     newAmbulanceMongoId,
        //     { status: 'Not Available' },
        //     { new: true }
        // );
        // console.log(`New ambulance (ID: ${newAmbulanceMongoId}) status set to 'Not Available'.`);
        // End

        const oldCrewMemberIds = existingCase.crewMembers.map((id: any) => id.toString());
        const newCrewMemberIds = resolvedStaffMongoIds.map((id: any) => id.toString());

        const newlyAssignedCrewIds = newCrewMemberIds.filter((id: string) => !oldCrewMemberIds.includes(id));
        const removedCrewIds = oldCrewMemberIds.filter((id: string) => !newCrewMemberIds.includes(id));

        for (const crewId of newlyAssignedCrewIds) {
            const crewMemberDoc = await user.findById(crewId);
            if (crewMemberDoc) {
                const newFatigueLevel = Math.max(0, crewMemberDoc.fatigueLevel - 1);
                await user.findByIdAndUpdate(
                    crewId,
                    { fatigueLevel: newFatigueLevel },
                    { new: true, runValidators: true }
                );
                console.log(`Fatigue Level decreased for newly assigned crew member ${crewId}.`);
            }
        }

        res.status(200).json({ message: 'Updated the case details successfully', data: updatedCase });

    } catch (e: any) {
        console.error('Failed to update emergency case due to a server error:', e);
        res.status(500).json({ message: 'Failed to update emergency case due to a server error.', error: e.message });
    }
};