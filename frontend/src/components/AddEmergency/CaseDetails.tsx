import {
    caseStatus,
    incidentTypes,
    priorityLevels,
} from "../../common/constants/constants";
import DropDown from "../../common/Dropdown";
import Input from "../../common/Input";
import { Grid } from "@mui/material";
import React, { type ChangeEvent } from "react";


const CaseDetails = ({ errors, state, updateField }: any) => {

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateField(name, value)

    };
    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateField(name, value)
    }

    return (
        <React.Fragment>
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Case Details</h2>
            <Grid container spacing={3} margin={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Emergency Type"
                        name="emergencyType"
                        selectHandle={selectHandler}
                        menuItems={incidentTypes}
                        error={errors.emergency__type?.error}
                        helperText={errors.emergency__type?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <Input
                        label="Incident Location"
                        name="incidentLocation"
                        changeHandle={changeHandler}
                        value={state.incidentLocation}
                        id="incident_location"
                        datatestid="incident_location"
                        error={errors.incident_location?.error}
                        helperText={errors.incident_location?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Priority"
                        name="priority"
                        selectHandle={selectHandler}
                        menuItems={priorityLevels}
                        error={errors.priority?.error}
                        helperText={errors.priority?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Case Status"
                        name="caseStatus"
                        menuItems={caseStatus}
                        selectHandle={selectHandler}
                        error={errors.case__status?.error}
                        helperText={errors.case__status?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Assign Ambulance"
                        name="ambulanceId"
                        menuItems={priorityLevels}
                        selectHandle={selectHandler}
                        error={errors.priority?.error}
                        helperText={errors.priority?.message}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default CaseDetails