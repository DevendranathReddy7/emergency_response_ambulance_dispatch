import { addAmbulance, deleteAmbulance, getAmbulance } from "../controllers/addGetAmbulance"
import { addStaff, getCrewMembers, deleteStaff, editStaff } from "../controllers/Staff"
import { emergencyLogger, updateEmergency } from "../controllers/emergencyLogger"
import getEmergencies from "../controllers/getEmergencies"

const express = require('express')
const router = express.Router()

router.post('/log-emergency', emergencyLogger)
router.put('/update-emergency', updateEmergency)
router.get('/get-emergency', getEmergencies)

router.post('/add-ambulance', addAmbulance)
router.get('/get-ambulance', getAmbulance)
router.delete('/delete-ambulance',deleteAmbulance)

router.post('/add-staff', addStaff)
router.get('/get-staff', getCrewMembers)
router.put('/update-staff', editStaff)
router.delete('/delete-staff', deleteStaff)

export default router