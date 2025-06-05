import {addAmbulance, getAmbulance} from "../controllers/addGetAmbulance"
import {addStaff, getCrewMembers} from "../controllers/addGetStaff"
import emergencyLogger from "../controllers/emergencyLogger"
import getEmergencies from "../controllers/getEmergencies"

const express  = require('express')
const router = express.Router()

router.post('/log-emergency',emergencyLogger)
router.get('/get-emergency',getEmergencies)

router.post('/add-ambulance',addAmbulance)
router.get('/get-ambulance',getAmbulance)

router.post('/add-staff', addStaff)
router.get('/get-staff',getCrewMembers)

export default router