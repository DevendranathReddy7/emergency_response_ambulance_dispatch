import { useReducer, useState, type FormEvent } from "react";

import MuiButton from "../../common/components/MuiButton";
import PatientDetails from "./PatientDetails";
import CaseDetails from "./CaseDetails";
import type { UIErrors } from "../../dataModals/Common";
import { useMutation } from "@tanstack/react-query";
import { logEmergencyCase } from "../../common/services/api";

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
    caseStatus: 'case__status'
}

function reducer(state: any, action: any) {
    switch (action.type) {
        case "UPDATE_FIELD":
            if (action.name === 'crewMembers') {
                return { ...state, [action.name]: [ ...[action.value]] };
            } else {
                return { ...state, [action.name]: action.value };
            }
        default:
            return state;
    }
}

const AddEmergency: React.FC = () => {
    const [currentView, setCurrentView] = useState<'caseDetails' | 'patientDetails'>('patientDetails')

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
        }
    });

    const [state, dispatch] = useReducer(reducer, intialState);

    const changeHandler = (name: string, value: string) => {
        dispatch({ type: 'UPDATE_FIELD', name, value })
        // if (name === 'patientMobile') {
        //     if (!/^[0-9]+$/.test(value)) {
        //         console.log(/^[0-9]+$/.test(value), name,value,'2--->')
        //         setErrors(prevErr => ({
        //             ...prevErr,
        //             [nameToErrorMap[name] as keyof UIErrors]: {
        //                 ...prevErr[nameToErrorMap[name] as keyof UIErrors],
        //                 error: true,
        //             },
        //         }));
        //     }
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
        if (state.patientGender === undefined || state.patientGender.trim() === "") {
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
        let validationError = false
        if (state.crewMembers[0] === state.crewMembers[1]) {
            validationError = true
        }
        return validationError
    };

    const { mutate, reset } = useMutation({
        mutationFn: (payload) => logEmergencyCase(payload),
        onSuccess: (data) => {
            console.log('Successfully logged:', data);
            reset();
        },
        onError: (err) => {
            console.error('Error logging:', err);
        },
    });

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isError = validateCaseDetails()
        if (!isError) {
            mutate(state);
        }
    };

    return (
        <div className="bg-gray-200 p-3 rounded m-3">
            <form onSubmit={submitHandler} >
                {currentView === 'caseDetails' && <CaseDetails errors={errors} state={state} updateField={changeHandler} />}

                {currentView === 'patientDetails' && <PatientDetails errors={errors} state={state} updateField={changeHandler} />}

                <div className={`flex justify-between mx-6 ${currentView === 'patientDetails' ? 'justify-end' : ''}`}>
                    {currentView === 'caseDetails' && <MuiButton btnType="button" variant="outlined" handleBtnClick={backBtnClickHandler}>Back</MuiButton>}
                    {currentView === 'patientDetails' && <MuiButton btnType='button' variant="contained" handleBtnClick={nextBtnClickHandler}>Next</MuiButton>}
                    {currentView === 'caseDetails' && <MuiButton btnType='submit' variant="contained" >Log Case</MuiButton>}
                </div>

            </form>
        </div>
    );
};

export default AddEmergency;
