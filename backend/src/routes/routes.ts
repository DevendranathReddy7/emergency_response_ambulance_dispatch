import {addAmbulance, getAmbulance} from "../controllers/addGetAmbulance"
import {addStaff, getCrewMembers} from "../controllers/addGetStaff"
import emergencyLogger from "../controllers/emergencyLogger"

const express  = require('express')
const router = express.Router()

router.post('/logEmergency',emergencyLogger)
router.post('/add-ambulance',addAmbulance)
router.get('/get-ambulance',getAmbulance)
router.post('/add-staff', addStaff)
router.get('/get-crewMembers',getCrewMembers)

export default router