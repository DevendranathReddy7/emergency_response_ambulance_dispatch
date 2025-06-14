import { Grid } from "@mui/material";
import Input from "../../common/components/Input";
import React, { type ChangeEvent } from "react";
import DropDown from "../../common/components/Dropdown";
import { gender } from "../../common/constants/constants";

const PatientDetails = ({ errors, state, updateField, flow,isMobileNumber }: any) => {

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        updateField(name, value)
    }

    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateField(name, value)
    }

    return (
        <React.Fragment>
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Patient Details</h2>
            <Grid container spacing={3} margin={3}>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <Input
                        label="Patient Name"
                        name="patientName"
                        changeHandle={changeHandler}
                        value={state.patientName}
                        id="patient__name"
                        datatestid="patient__name"
                        // error={errors.patient__name?.error}
                        // helperText={errors.patient__name?.message}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <Input
                        label="Patient Mobile"
                        name="patientMobile"
                        changeHandle={changeHandler}
                        value={state.patientMobile}
                        id="patient__mobile"
                        datatestid="patient__mobile"
                        error={errors.patient__mobile?.error}
                        helperText={errors.patient__mobile?.message}
                        readOnly ={flow === 'edit' && isMobileNumber}
                    />
                </Grid>



                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Gender"
                        name="patientGender"
                        menuItems={gender}
                        value={state.patientGender}
                        selectHandle={selectHandler}
                        error={errors.patient__gender?.error}
                        helperText={errors.patient__gender?.message}
                    />
                </Grid>


                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <Input
                        label="Patient Age"
                        name="patientAge"
                        changeHandle={changeHandler}
                        value={state.patientAge}
                        id="patient__age"
                        datatestid="patient__age"
                    // error={errors.patient__name?.error}
                    // helperText={errors.patient__name?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <Input
                        label="Patient Address"
                        name="patientAddress"
                        changeHandle={changeHandler}
                        value={state.patientAddress}
                        id="patient__address"
                        datatestid="patient__address"
                    // error={errors.patient__name?.error}
                    // helperText={errors.patient__name?.message}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default PatientDetails