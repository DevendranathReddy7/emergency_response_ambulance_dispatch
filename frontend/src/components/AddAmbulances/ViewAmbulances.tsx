import { useMutation, useQuery } from "@tanstack/react-query"
import Loader from "../../common/components/Loader"
import { deleteAmbulance, deleteTheUser, getAvailableAmbulances } from "../../common/services/api"
import DynamicTable from "../../common/components/Table"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import BasicModal from "../../common/components/Modal"
import { toast } from "react-toastify"

const deleteWarning = {
    title: 'Confirm Deletion',
    content: 'You are about to permanently delete this Vehicle. This action cannot be undone. Do you wish to continue?',
    buttons: ['Cancel', 'Delete']
}

const ViewAmbulances = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const navigate = useNavigate()
    const [currentDeletingAmbulance, setCurrentDeletingAmbulance] = useState<string>('')
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['view-ambulance'],
        queryFn: () => getAvailableAmbulances('all')
    })


    
    const { mutate: deleteMutate, reset: deleteReset } = useMutation({
        mutationFn: () => deleteAmbulance(currentDeletingAmbulance),
        onSuccess: () => {
            toast.success('Ambulance is Successfully deleted')
            deleteReset()
        },
        onError: (err) => {
            console.log(err)
            toast.error(`Failed to delete the Ambulance: ${err.message}`)
            deleteReset()
        }
    })

    const handleUpdate = (id: string) => {

    }


    const handleUserDelete = () => {
        setIsOpen(false)
        deleteMutate()
    }

     const handleModal = () => {
        setIsOpen(false)
    }

    const showWarning = () => {
        return (
            <BasicModal isOpen={isOpen} handleModal={handleModal} confirmContent={deleteWarning} handleConfirmation={handleUserDelete} />
        )
    }

    const handleDelete = (id: string) => {
        setCurrentDeletingAmbulance(id)
        setIsOpen(true)
    }

    const transformData = (data: any) => {
        const newData = data?.map((obj: any) => {
            const { _id, ambulanceType, status, vehicleNumber } = obj

            return {
                id: _id,
                'Vehicle Number': vehicleNumber,
                'Ambulance Type': ambulanceType,
                Status: status,
                Actions: ['Edit', 'Delete']

            }
        })
        return newData

    }
    const updatedData = transformData(data?.data?.data)

    return (
        <div className="rounded-lg p-6 shadow-md m-3 bg-white">
            {isLoading && <Loader size={40} thickness={4} fullScreen={false} msg="Please wait while we're adding" />}
            <DynamicTable data={updatedData} updateDetails={handleUpdate} deleteDetails={handleDelete} />
            {!isLoading && !isError && updatedData.length === 0 && (
                <p className="text-center text-gray-500 py-4">Currently we don't have any Ambulances available with us.</p>
            )}

            {isOpen && showWarning()}
        </div>
    )
}

export default ViewAmbulances