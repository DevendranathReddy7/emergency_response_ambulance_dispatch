import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteTheUser, getAvailableCrewStaff } from "../../common/services/api";
import Loader from "../../common/components/Loader";
import DynamicTable from "../../common/components/Table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BasicModal from "../../common/components/Modal";

interface RawStaffMember {
    _id: string;
    email: string;
    role: string;
    name: string;
    status: string;
    fatigueLevel: number;
    age: string;
    gender: string;
    mobile: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface TransformedStaffMember {
    Name: string;
    Email: string;
    Mobile: string;
    Gender: string;
    Role: string;
    Status: string;
    'Fatigue Level': number;
    Age: string;
    Address: string;
    Actions: string[];
    id?: string;
}

const deleteWarning = {
    title: 'Confirm Deletion',
    content: 'You are about to permanently delete this user. This action cannot be undone. Do you wish to continue?',
    buttons: ['Cancel', 'Delete']
}

const UsersList = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [currentDeletingUser, setCurrentDeletingUser] = useState<string>('')

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['get-staff', 'all', 'all'],
        queryFn: () => getAvailableCrewStaff('all', 'all')
    });


    useEffect(() => {
        if (isError) {
            toast.error('Failed to Load the Users List')
        }
    }, [error])


    const handleEditUser = (id: string) => {

    }

    const handleModal = () => {
        setIsOpen(false)
    }

    const { mutate: deleteMutate, reset: deleteReset, isPending:deletePending } = useMutation({
        mutationFn: () => deleteTheUser(currentDeletingUser),
        onSuccess: () => {
            toast.success('User is Successfully deleted')
            deleteReset()
        },
        onError:()=>{
            toast.error('Failed to delete the user')
            deleteReset()
        }
    })

    const handleUserDelete = () => {
        setIsOpen(false)
        deleteMutate()
    }

    const showWarning = () => {
        return (
            <BasicModal isOpen={isOpen} handleModal={handleModal} confirmContent={deleteWarning} handleConfirmation={handleUserDelete} />
        )
    }

    const handleDeleteModal = (id: string) => {
        setCurrentDeletingUser(id)
        setIsOpen(true)
    }

    const transformStaffData = (rawData: { data: RawStaffMember[] } | undefined): TransformedStaffMember[] => {
        if (!rawData?.data || !Array.isArray(rawData.data)) {
            return [];
        }

        const newData = rawData.data
            .filter((member: RawStaffMember) => member.role !== 'Patient')
            .map((member: RawStaffMember) => {
                const { _id, name, email, mobile, gender, role, status, fatigueLevel, age, address } = member;

                let formattedRole = ''
                if (role === 'Emergency response staff') {
                    formattedRole = 'ER Staff'
                } else if (role === 'Triage staff') {
                    formattedRole = 'TR Staff'
                } else if (role === 'Admin') {
                    formattedRole = 'Admin'
                }

                return {
                    id: _id,
                    Name: name,
                    Email: email,
                    Mobile: mobile,
                    Gender: gender,
                    Role: formattedRole,
                    Status: status,
                    'Fatigue Level': fatigueLevel,
                    Age: age,
                    Address: `${address.slice(0, 13)}...`,
                    Actions: ['Edit', 'Delete']
                };
            });

        return newData;
    };

    const updatedData = transformStaffData(data?.data);

    return (
        <div className="rounded-lg p-6 shadow-md m-3 bg-white">
            <h2 className="text-2xl/3 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight m-3 mt-0">Users</h2>

            {isLoading && <Loader size={40} thickness={4} fullScreen={false} msg="Please Wait while we're Loading" />}
            {deletePending && <Loader size={40} thickness={4} fullScreen={false} msg="Please Wait while we're Deleting" />}

            {!isLoading && !isError && updatedData.length > 0 && (
                //@ts-ignore
                <DynamicTable data={updatedData} updateDetails={handleEditUser} deleteDetails={handleDeleteModal} />
            )}

            {!isLoading && !isError && updatedData.length === 0 && (
                <p className="text-center text-gray-500 py-4">No staff data available after filtering.</p>
            )}
            {isOpen && showWarning()}
        </div>
    );
};

export default UsersList;