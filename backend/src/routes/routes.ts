import addAmbulance from "../controllers/addAmbulance"
import addStaff from "../controllers/addStaff"
import emergencyLogger from "../controllers/emergencyLogger"

const express  = require('express')
const router = express.Router()

router.post('/logEmergency',emergencyLogger)
router.post('/add-ambulance',addAmbulance)
router.post('/add-staff', addStaff)

export default router