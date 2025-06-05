import { useState } from "react";
import BasicModal from "./Modal";
import type { TableProps } from "../../dataModals/Common"; // Assuming this path is correct

const DynamicTable = ({ data, updateCaseDetails }: TableProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalData, setModalData] = useState<any>(null);

    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 py-4">No data to display at the moment. Please check back later!</p>;
    }

    const columns = [...new Set(data.flatMap(obj => Object.keys(obj).filter(key => !key.toLowerCase().includes('id'))))];

    const renderCell = (value: any, col: string, row: any) => {
        if (col === 'Actions' && Array.isArray(value)) {
            return (
                <div className="flex justify-center space-x-2">
                    {value.map((action, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded-sm text-white ${action === 'View' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-800 hover:bg-blue-400'}`}
                            onClick={() => handleAction(action, row.id, row)}
                        >
                            {action}
                        </button>
                    ))}
                </div>
            );
        }
        if (col === 'Priority') {
            const priorityColors: { [key: string]: { bg: string; text: string } } = {
                '1 - Highest': { bg: 'bg-red-100', text: 'text-red-800' },
                '2 - High': { bg: 'bg-orange-100', text: 'text-orange-800' },
                '3 - Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
                '4 - Low': { bg: 'bg-green-100', text: 'text-green-800' },
                '5 - Least': { bg: 'bg-blue-100', text: 'text-blue-800' },
                'default': { bg: 'bg-gray-100', text: 'text-gray-800' },
            };
            const colorClasses = priorityColors[value as keyof typeof priorityColors] || priorityColors.default;
            return (
                <div className={`inline-block ${colorClasses.bg} p-1 sm:py-1 rounded-3xl min-w-[80px]`}>
                    <p className={`text-sm font-medium ${colorClasses.text}`}>{value}</p>
                </div>
            );
        } else if (Array.isArray(value)) {
            return value.join(', ');
        } else if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
            return Object.values(value).join(', ');
        }
        return value ? String(value) : '-';
    };

    const handleAction = (actionType: string, id: string, rowData: any) => {
        if (actionType === 'View') {
            setModalData(rowData);
            setIsModalOpen(true);
        } else if (actionType === 'Edit') {
            updateCaseDetails(id);
        }
    };

    const handleModalStatus = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    return (
        <div>
            {isModalOpen && modalData ? <BasicModal isOpen={isModalOpen} handleModal={handleModalStatus}  data={modalData}/> : null}

            <div className="hidden md:block overflow-x-auto rounded-md">
                <table className="border-collapse min-w-full">
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="text-center p-2 bg-gray-100 border-b border-gray-300">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                                {columns.map((col, i) => (
                                    <td key={i} className="text-center p-2 align-top">
                                        {renderCell((row as any)[col], col, row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                {data.map((row, idx) => (
                    <div key={idx} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                        {columns.filter(col => col !== 'Actions').map((col, i) => (
                            <div key={i} className="mb-2 last:mb-0 flex items-center justify-between"> 
                                <span className="font-semibold text-gray-700 text-sm flex-shrink-0 mr-2"> 
                                    {col}:
                                </span>
                                <div className="text-gray-900 text-base text-right flex-grow"> 
                                    {renderCell((row as any)[col], col, row)}
                                </div>
                            </div>
                        ))}

                        {(row as any).Actions && Array.isArray((row as any).Actions) && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                                {(row as any).Actions.map((action: string, i: number) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-2 rounded-md text-white text-sm font-medium
                                            ${action === 'View' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-800 hover:bg-blue-400'}`}
                                        onClick={() => handleAction(action, row.id, row)}
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicTable;