import {
    caseStatus,
    incidentTypes,
    priorityLevels,
} from "../../common/constants/constants";
import DropDown from "../../common/components/Dropdown";
import Input from "../../common/components/Input";
import { Grid } from "@mui/material";
import React, { useEffect, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableAmbulances, getAvailableCrewStaff } from "../../common/services/api";
import type { AmbulanceData } from "../../dataModals/Common";
import { toast } from "react-toastify";
import ShowBanner from "../../common/components/ShowBanner";
//import MuiButton from "../../common/components/MuiButton";


const CaseDetails = ({ errors, state, updateField, flow, prevAmbulance, prevCrew }: any) => {
    //const [showExtraCrew, setShowExtraCrew] = useState<boolean>(false)
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateField(name, value)

    };
    const selectHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateField(name, value)
    }

    const { data: ambulanceData, isLoading: isAmbulanceLoading, isError: isAmbulanceError } = useQuery({
        queryKey: ['get-ambulances'],
        queryFn: ()=>getAvailableAmbulances('Available'),
        staleTime: 1 * 60 * 1000,
    });

    const { data: crewData, isLoading: isCrewLoading, isError: isCrewError } = useQuery({
        queryKey: ['get-crew'],
        queryFn: () => getAvailableCrewStaff('erStaff', 'Active'),
        staleTime: 1 * 60 * 1000,

    });

    useEffect(() => {
        if (isAmbulanceError) {
            toast.error('Failed to fetch available Ambulance\'s details');
        }
    }, [isAmbulanceError]);

    useEffect(() => {
        if (isCrewError) {
            toast.error('Failed to fetch available crew members');
        }
    }, [isCrewError]);

    const renderAmbulances = () => {
        if (flow === 'edit') {
            return [prevAmbulance]
        }
        if (isAmbulanceLoading) {
            return ['Please wait while we\'re loading'];
        } else if (isAmbulanceError || ambulanceData?.data?.data?.length === 0) {
            return ['Failed to fetch available ambulances']
        } else {
            return ambulanceData?.data?.data?.map((ambulance: AmbulanceData) => {
                return `${ambulance.vehicleNumber} -- ${ambulance.ambulanceType}`;
            }) || [];
        }
    };

    const renderCrewMembers = () => {

        if (flow === 'edit') {
            return [prevCrew[0]]
        }
        if (isCrewLoading) {
            return ['Please wait while we\'re loading'];
        } else if (isCrewError) {
            return ['Failed to fetch available crew members'];
        } else {
            return crewData?.data?.data?.map((crew: any) => {
                let updatedFatigue = `${parseInt(crew.fatigueLevel) * 20}%`
                return `${crew.name} - ${crew.email} - FL : ${updatedFatigue}`;
            }) || [];
        }
    };

    // const renderExtraCrewMembers = () => {
    //     if (isCrewLoading) {
    //         return ['Please wait while we\'re loading'];
    //     } else if (isCrewError) {
    //         return ['Failed to fetch available crew members'];
    //     } else {
    //         const selectedCrewEmail = state.crewMembers[0]?.staff1?.split('-')[1]?.trim();
    //         return crewData?.data?.data?.filter((crew: any) => crew.email !== selectedCrewEmail).map((crew: any) => {
    //             return `${crew.name} - ${crew.email}`;
    //         }) || [];
    //     }
    // };

    // const addoneMoreCrew = () => {
    //     setShowExtraCrew(prev => !prev)
    // }

    return (
        <React.Fragment>
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5">Case Details</h2>
            {(isAmbulanceError || ambulanceData?.data?.data?.length === 0) && <ShowBanner type='warning' msg="We currently don't have any ambulances available Please try other transportation options to get the patient to the hospital" />}
            {(isCrewError || crewData?.data?.data?.length === 0) && <ShowBanner type="warning" msg="We currently don't have any staff available to assign.." />}
            <Grid container spacing={3} margin={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Emergency Type"
                        name="emergencyType"
                        selectHandle={selectHandler}
                        menuItems={incidentTypes}
                        value={state.emergencyType}
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
                        id="incident__location"
                        datatestid="incident__location"
                        error={errors.incident__location?.error}
                        helperText={errors.incident__location?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Priority"
                        name="priority"
                        value={state.priority}
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
                        value={state.caseStatus}
                        selectHandle={selectHandler}
                        error={errors.case__status?.error}
                        helperText={errors.case__status?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Assign Ambulance"
                        name="ambulanceId"
                        menuItems={renderAmbulances()}
                        value={state.ambulanceId}
                        selectHandle={selectHandler}
                        error={errors.assign__ambulance?.error}
                        helperText={errors.assign__ambulance?.message}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="crew Members"
                        name="crewMembers"
                        menuItems={renderCrewMembers()}
                        value={state.crewMembers[0]}
                        selectHandle={selectHandler}
                        error={errors.assign__crew?.error}
                        helperText={errors.assign__crew?.message}
                    />
                </Grid>

                {/* {showExtraCrew && <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    <DropDown
                        fieldName="Extra Crew Members"
                        name="crewMembers_staff2"
                        menuItems={renderExtraCrewMembers()}
                        value={state.crewMembers[1].staff2}
                        selectHandle={selectHandler}
                    // error={errors.priority?.error}
                    // helperText={errors.priority?.message}
                    />
                </Grid>}

                <MuiButton btnType="button" variant="contained" handleBtnClick={addoneMoreCrew}>{showExtraCrew ? 'Remove Extra Crew Member' : 'Add Extra Crew Member'}</MuiButton> */}
            </Grid>
        </React.Fragment>
    )
}

export default CaseDetails