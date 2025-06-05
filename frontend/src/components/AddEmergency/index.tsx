import { useEffect, useReducer, useState, type FormEvent } from "react";

import MuiButton from "../../common/components/MuiButton";
import PatientDetails from "./PatientDetails";
import CaseDetails from "./CaseDetails";
import type { UIErrors } from "../../dataModals/Common";
import { useMutation } from "@tanstack/react-query";
import { logEmergencyCase, updateEmergencyCase } from "../../common/services/api";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

const intialState = {
    incidentLocation: "",
    emergencyType: "",
    priority: "",
    //incidentDescription: "",
    ambulanceId: "",
    crewMembers: [],
    patientName: '',
    patientAge: '',
    patientMobile: '',
    patientGender: '',
    patientAddress: '',
    caseStatus: ''
};

const nameToErrorMap: { [key: string]: keyof UIErrors | undefined } = {
    patientGender: 'patient__gender',
    patientMobile: 'patient__mobile',
    incidentLocation: 'incident__location',
    emergencyType: "emergency__type",
    priority: "priority",
    ambulanceId: "assign__ambulance",
    caseStatus: 'case__status',
    crewMembers: 'assign__crew'
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "UPDATE_FIELD":
            if (action.name === 'crewMembers') {
                return { ...state, [action.name]: [...[action.value]] };
            } else {
                return { ...state, [action.name]: action.value };
            }
        case "UPDATE_BY_EDIT":
            return { ...state, ...action.payload }
        case "RESET":
            return { ...intialState }

        default:
            return state;
    }
}

const AddEmergency: React.FC = () => {
    const location = useLocation();
    const { id: editingDocId } = useParams()
    const [currentView, setCurrentView] = useState<'caseDetails' | 'patientDetails'>('patientDetails')
    const { mode = 'add', formData = {} } = location.state || {}

    useEffect(() => {
        if (mode === 'edit' && formData) {
            dispatch({ type: 'UPDATE_BY_EDIT', payload: formData })
        }
    }, [mode, formData])

    useEffect(() => {
        if (mode === 'add') {
            dispatch({ type: 'RESET' })
        }
    }, [mode])

    const [errors, setErrors] = useState<UIErrors>({
        incident__location: {
            error: false,
            message: "Please enter the incident location",
        },
        emergency__type: { error: false, message: "Please select emergency type" },
        priority: { error: false, message: "Please select the incident priority" },
        case__status: {
            error: false,
            message: "Please choose the current status of the case",
        },
        assign__ambulance: {
            error: false,
            message: "Please assign an ambulance to the case",
        },
        patient__gender: {
            error: false,
            message: "Please enter the patient gender",
        },
        patient__mobile: {
            error: false,
            message: "Mobile number can only be a number"
        }, assign__crew: {
            error: false,
            message: "Please assign this incident to availble crew members"
        }
    });

    const [state, dispatch] = useReducer(reducer, intialState);

    const changeHandler = (name: string, value: string) => {
        dispatch({ type: 'UPDATE_FIELD', name, value })
        // if (name === 'patient__mobile' && !(/^[0-9]+$/.test(value))) {
        //     setErrors(prevErrors => ({
        //         ...prevErrors,
        //         [name]: { message: 'Please enter numbers only', error: true }
        //     }));
        // } 

        if (value !== '' || value !== undefined) {
            setErrors(prevErr => ({
                ...prevErr,
                [nameToErrorMap[name] as keyof UIErrors]: {
                    ...prevErr[nameToErrorMap[name] as keyof UIErrors],
                    error: false,
                },
            }));
        }
    }

    const validatePatentDetails = () => {
        if (state.patientGender === undefined || state.patientGender?.trim() === "") {
            setErrors((prev) => ({
                ...prev,
                patient__gender: { ...prev.patient__gender, error: true },
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                patient__gender: { ...prev.patient__gender, error: false },
            }));
            setCurrentView('caseDetails')
        }
    };


    const nextBtnClickHandler = () => {
        validatePatentDetails()
    }

    const backBtnClickHandler = () => {
        setCurrentView('patientDetails')
    }

    const validateCaseDetails = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!state.incidentLocation) {
            newErrors.incident__location = { error: true, message: "Please enter the incident location" };
            isValid = false;
        } else {
            newErrors.incident__location.error = false;
        }

        if (!state.emergencyType) {
            newErrors.emergency__type = { error: true, message: "Please select emergency type" };
            isValid = false;
        } else {
            newErrors.emergency__type.error = false;
        }

        if (!state.priority) {
            newErrors.priority = { error: true, message: "Please select the incident priority" };
            isValid = false;
        } else {
            newErrors.priority.error = false;
        }

        if (!state.caseStatus) {
            newErrors.case__status = { error: true, message: "Please choose the current status of the case" };
            isValid = false;
        } else {
            newErrors.case__status.error = false;
        }

        if (!state.ambulanceId) {
            newErrors.assign__ambulance = { error: true, message: "Please assign an ambulance to the case" };
            isValid = false;
        } else {
            newErrors.assign__ambulance.error = false;
        }

        if (!state.crewMembers || state.crewMembers.length === 0) {
            newErrors.assign__crew = { error: true, message: "Please assign at least one crew member" };
            isValid = false;
        } else {
            if (newErrors.assign__crew) newErrors.assign__crew.error = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const { mutate: addMutate, reset:addReset, isPending:addPending } = useMutation({
        mutationFn: (payload) => logEmergencyCase(payload),
        onSuccess: () => {
            toast.success('Inclident is Successfully logged')
            addReset()
            dispatch({ type: 'RESET' })
        },
        onError: (err) => {
            console.error('Error logging:', err);
            toast.error('Failed to log the inclident')

        },
    });

    const { mutate: updateMutate, reset:updateReset , isPending:updatePending} = useMutation({
        mutationFn: (payload) => updateEmergencyCase(payload),
        onSuccess: () => {
            toast.success('Inclident is Successfully updated')
            updateReset()
            dispatch({ type: 'RESET' })
        },
        onError: (err) => {
            console.error('Error logging:', err);
            toast.error('Failed to update the inclident')

        },
    });

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateCaseDetails()
        if (isValid) {
            if (mode === 'add') {
                addMutate(state);
            } else {
                updateMutate({
                    ...state, editingDocId
                })
            }
        }
    };

    return (
        <div className="bg-gray-200 p-3 rounded m-3">
            <form onSubmit={submitHandler} >
                {currentView === 'caseDetails' && <CaseDetails errors={errors} state={state} updateField={changeHandler} flow={mode} prevAmbulance={formData.ambulanceId} prevCrew={formData.crewMembers} />}

                {currentView === 'patientDetails' && <PatientDetails errors={errors} state={state} updateField={changeHandler} flow={mode} isMobileNumber={formData.patientMobile}/>}

                <div className={`flex justify-between mx-6 ${currentView === 'patientDetails' ? 'justify-end' : ''}`}>
                    {currentView === 'caseDetails' && <MuiButton btnType="button" variant="outlined" handleBtnClick={backBtnClickHandler}>Back</MuiButton>}
                    {currentView === 'patientDetails' && <MuiButton btnType='button' variant="contained" handleBtnClick={nextBtnClickHandler}>Next</MuiButton>}
                    {currentView === 'caseDetails' && <MuiButton btnType='submit' variant="contained" disable={addPending || updatePending}>{mode === 'add' ? 'Log Case' : 'Update Case'}</MuiButton>}
                </div>

            </form>
        </div>
    );
};

export default AddEmergency;
