import { useQuery } from "@tanstack/react-query"
import Loader from "../../common/components/Loader"
import { getEmergencyCase } from "../../common/services/api"
import DynamicTable from "../../common/components/Table"
import { formatTimestamp } from "../../common/utils"
import { useEffect, useState } from "react"
import { ShowPagination } from "../../common/components/Pagination"
import { useNavigate } from "react-router-dom"
import SearchFilter from "../../common/components/SearchFilter"

const Dashboard = () => {
    const navigate = useNavigate()

    const [paginationDetails, setPaginationDetails] = useState({ totalResults: 0, totalPages: 1, pageSize: 0, currentPage: 1 })
    const [searchValue, setSearchValue] = useState<string>('')

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['get-emergencies', paginationDetails.currentPage],
        queryFn: () => getEmergencyCase(paginationDetails.currentPage)
    });

    useEffect(() => {
        if (data) {
            setPaginationDetails(prev => ({
                ...prev, totalResults: data.totalCases,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                pageSize: data.pageSize,
            }))
        }
    }, [data])

    const handlePageChange = (i: number) => {
        setPaginationDetails(prev => ({ ...prev, currentPage: i + 1 }))
        // setSearchValue('')
    }

    const handlePrevNextChange = (i: number) => {
        setPaginationDetails(prev => ({ ...prev, currentPage: i }))
        //setSearchValue('')
    }

    function transformEmergencyData(rawData: any) {
        return rawData?.map((incident: any) => {
            const { emergencyType, incidentLocation, status, priority, createdAt } = incident._doc;
            const patientName = incident.patientDetails ? incident.patientDetails.name : 'N/A';

            const vehicleNumber = incident.ambulanceId ? incident.ambulanceId.vehicleNumber : 'N/A';

            return {
                'Patient name': patientName,
                'Emergency type': emergencyType,
                'Incident location': incidentLocation,
                Status: status,
                Priority: priority,
                'Ambulance assigned': vehicleNumber,
                Date: formatTimestamp(createdAt),
                Actions: ['Edit'],
                id: incident._doc._id
            };
        });
    }

    const newObj = transformEmergencyData(data?.updatedEmeregencies)

    const handleEditCase = (id: string) => {

        const filteredObj = data?.updatedEmeregencies.filter((obj: any) => {
            return obj._doc._id === id;
        });

        const { incidentLocation, emergencyType, priority, status } = filteredObj[0]._doc;
        const { vehicleNumber, ambulanceType } = filteredObj[0].ambulanceId;
        const { name:crewName, email, fatigueLevel } = filteredObj[0]?.crewDetails;

        let patientName = null;
        let patientAge = null;
        let patientMobile = null;
        let patientGender = undefined;
        let patientAddress = null;

        if (filteredObj[0].patientDetails) {
            const { name, age, mobile, gender, address } = filteredObj[0].patientDetails;
            patientName = name;
            patientAge = age;
            patientMobile = mobile;
            patientGender = gender;
            patientAddress = address;
        }

        navigate(`/update-caseDetails/${id}`, {
            state: {
                mode: 'edit',
                formData: {
                    incidentLocation,
                    emergencyType,
                    priority,
                    ambulanceId: `${vehicleNumber} -- ${ambulanceType}`,
                    crewMembers: [`${crewName} - ${email} - FL: ${parseInt(fatigueLevel)*20}%`],
                    patientName,
                    patientAge,
                    patientMobile,
                    patientGender,
                    patientAddress,
                    caseStatus: status
                }
            }
        });
    }

    const searchHandle = (value: string): string => {
        setSearchValue(value);
        return value;
    };


    return (
        <div className="rounded-lg p-6 shadow-md m-3 bg-white">
            <h2 className="text-1xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mx-5 mb-3">Reported Cases</h2>
            {isLoading && <Loader size={40} thickness={4} fullScreen={false} msg="Please wait while we're Loading" />}
            {/* <SearchFilter onSearch={searchHandle} searchValue={searchValue}/> */}
            {!isLoading && <DynamicTable data={newObj} updateDetails={handleEditCase} />}
            {newObj?.length > 0 && <ShowPagination pagination={paginationDetails} updatePage={handlePageChange} prevNext={handlePrevNextChange} />}
        </div>
    )
}

export default Dashboard