import { Grid } from "@mui/material"
import Input from "../../common/components/Input"
import MuiButton from "../../common/components/MuiButton"
import { useMutation } from "@tanstack/react-query"
import { addAmbulance } from "../../common/services/api"
import { toast } from "react-toastify"
import { useReducer, useState, type ChangeEvent, type FormEvent } from "react"
import Loader from "../../common/components/Loader"
import { ambulanceType } from "../../common/constants/constants"
import DropDown from "../../common/components/Dropdown"

const initalState = {
    "vehicleNumber": '',
    "ambulanceType": ''
}

const reducer = (state: any, action: any) => {

    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.name]: action.value }
        case 'RESET':
            return initalState
        default:
            return state

    }

}

const AddAmbulance = () => {

    const [state, dispatch] = useReducer(reducer, initalState)
    const { mutate, reset, isPending } = useMutation({
        mutationFn: (payload) => addAmbulance(payload),
        onSuccess: () => {
            dispatch({ type: 'RESET' })
            toast.success('Ambulance added succsufully')
            reset();

        },
        onError: (err) => {
            toast.error(`Failed to add the user: ${err.message}`)
        },
    })

    const [errors, setErrors] = useState({
        vehicleNumber: {
            error: false,
            message: 'Vehicle Number is Required'
        },
        ambulanceType: {
            error: false,
            message: 'Ambulance type is Required'
        },

    })

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        dispatch({ type: "UPDATE_FIELD", name, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors, error: false }
        }));


    };

    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        dispatch({ type: "UPDATE_FIELD", name, value });
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: { ...prevErrors, error: false }
        }));
    };

    const validateUIFields = () => {

        let isValid = true;
        const newErrors = { ...errors };

        if (!state.vehicleNumber) {
            newErrors.vehicleNumber = { error: true, message: 'Vehical Number is Required' };
            isValid = false;
        } else {
            newErrors.vehicleNumber.error = false;
        }

        if (!state.ambulanceType) {
            newErrors.ambulanceType = { error: true, message: 'Ambulance type is Required' };
            isValid = false;
        } else {
            newErrors.ambulanceType.error = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const isValid = validateUIFields()
        if (isValid) {
            mutate(state)
        }
    }

    return (

        <div className="bg-gray-200 p-3 rounded m-3">
            {isPending && <Loader msg="Please wait while we're adding"/>}
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Add an Ambulance</h2>
            <form onSubmit={submitHandler}>
                <Grid container spacing={3} margin={3}>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <Input
                            label="Vehicle Number"
                            name="vehicleNumber"
                            changeHandle={changeHandler}
                            value={state.vehicleNumber}
                            id="vehicleNumber"
                            datatestid="vehicleNumber"
                            error={errors.vehicleNumber?.error}
                            helperText={errors.vehicleNumber?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        <DropDown
                            fieldName="Ambulance Type"
                            name="ambulanceType"
                            menuItems={ambulanceType}
                            value={state.ambulanceType}
                            selectHandle={selectHandler}
                            error={errors.ambulanceType?.error}
                            helperText={errors.ambulanceType?.message}
                        />
                    </Grid>


                </Grid>

                <div className="flex justify-end mx-6">
                    <MuiButton btnType='submit' variant="contained">Add Ambulance</MuiButton>

                </div>
            </form>
        </div>
    )
}

export default AddAmbulance