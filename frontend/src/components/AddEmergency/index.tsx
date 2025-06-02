import { useReducer, useState, type FormEvent } from "react";

import MuiButton from "../../common/MuiButton";
import PatientDetails from "./PatientDetails";
import CaseDetails from "./CaseDetails";
import type { UIErrors } from "../../dataModals/Common";

const intialState = {
    incidentLocation: "",
    emergencyType: "",
    priority: "",
    status: "",
    incidentDescription: "",
    ambulanceId: "",
    crewMembers: [],
    patientName: '',
    patientAge: '',
    patientMobile: '',
    patientGender: '',
    patientAddress: ''
};

function reducer(state: any, action: any) {
            console.log(action)

    switch (action.type) {
        // case 'SET_ALL':
        //     return { ...state, ...action.payload }
        case "UPDATE_FIELD":
            return { ...state, [action.name]: action.value };
        default:
            return state;
    }
}

const AddEmergency: React.FC = () => {
    const [currentView, setCurrentView] = useState<'caseDetails' | 'patientDetails'>('caseDetails')

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
        }
    });

    const [state, dispatch] = useReducer(reducer, intialState);

    const changeHandler = (name: string, value: string) => {
        dispatch({ type: 'UPDATE_FIELD', name, value })
    }

    const nextBtnClickHandler = () => {
        setCurrentView('patientDetails')
    }

    const backBtnClickHandler = () => {
        setCurrentView('caseDetails')
    }

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="bg-gray-200 p-3 rounded m-3">
            <form onSubmit={submitHandler} >
                {currentView === 'caseDetails' && <CaseDetails errors={errors} state={state} updateField={changeHandler} />}

                {currentView === 'patientDetails' && <PatientDetails errors={errors} state={state} updateField={changeHandler}/>}

                <div className={`flex justify-between mx-6 ${currentView === 'caseDetails' ? 'justify-end' : ''}`}>
                    {currentView === 'patientDetails' && <MuiButton btnType="button" variant="outlined" handleBtnClick={backBtnClickHandler}>Back</MuiButton>}
                    <MuiButton btnType={currentView === 'patientDetails' ? 'submit' : 'button'} variant="contained" handleBtnClick={nextBtnClickHandler}>{currentView === 'patientDetails' ? "Log Case" : "Next"}</MuiButton>
                </div>

            </form>
        </div>
    );
};

export default AddEmergency;
