import { NextFunction, Request, Response } from "express";
import emergencyCase from "../models/emergencyCase";
import user from "../models/user";
import ambulance from "../models/ambulance";

const getEmergencies = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const reqPage = parseInt(page as string, 10) || 1;
    const reqLimit = parseInt(limit as string, 10) || 10;

    if (reqPage <= 0 || reqLimit <= 0) {
        res.status(400).json({ message: 'Invalid page or limit values' });
        return
    }
    const skip = (reqPage - 1) * reqLimit;

    try {
        const totalCases = await emergencyCase.countDocuments();
        const currentEmergencies = await emergencyCase.find().skip(skip).limit(reqLimit).sort({ createdAt: -1 }).exec()

        async function processEmergencies(currentEmergencies: any) {
            const updatedEmergencies = await Promise.all(
                currentEmergencies.map(async (incident: any) => {
                    const patientDetails = await user.findById(incident.patientDetails);
                    const ambulanceDetails = await ambulance.findById(incident.ambulanceId);
                    const crewDetails = await user.findById(incident.crewMembers[0])
                    return {
                        ...incident,
                        patientDetails: patientDetails,
                        ambulanceId: ambulanceDetails,
                        crewDetails
                    };
                })
            );

            return updatedEmergencies;
        }

        const updatedEmeregencies = await processEmergencies(currentEmergencies)

        res.status(200).json({
            totalCases,
            totalPages: Math.ceil(totalCases / reqLimit),
            currentPage: reqPage,
            pageSize: reqLimit,
            updatedEmeregencies
        })
    } catch (error: any) {
        res.status(500).json({ message: "Error while fetching current incidents", error: error });

    }
}

export default getEmergencies