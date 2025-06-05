import { useState } from "react";
import BasicModal from "./Modal";
import type { TableProps } from "../../dataModals/Common";

const DynamicTable = ({ data, updateCaseDetails }: TableProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    if (!data || data.length === 0) return <p className="text-center text-gray-500 py-4">No data to display at the moment. Please check back later!</p>;

    const columns = [...new Set(data.flatMap(obj => Object.keys(obj).filter(key => !key.includes('id'))))];

    const renderCell = (value: any, col: string, rowId: string) => {
        if (col === 'Actions' && Array.isArray(value)) {
            return (
                <div className="flex justify-center space-x-2">
                    {value.map((action, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded-sm text-white ${action === 'View' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-800 hover:bg-blue-400'
                                }`}
                            onClick={() => handleAction(action, rowId)}
                        >
                            {action}
                        </button>
                    ))}
                </div>
            );
        }
        if (col === 'Priority') {
            const priorityColors = {
                '1 - Highest': { bg: 'bg-red-100', text: 'text-red-800' },
                '2 - High': { bg: 'bg-orange-100', text: 'text-orange-800' },
                '3 - Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
                '4 - Low': { bg: 'bg-green-100', text: 'text-green-800' },
                '5 - Least': { bg: 'bg-blue-100', text: 'text-blue-800' },
                'default': { bg: 'bg-gray-100', text: 'text-gray-800' },
            };
            //@ts-ignore
            const colorClasses = priorityColors[value] || priorityColors.default;
            return (

                <div className={`space-x-2 ${colorClasses.bg} p-1 rounded-md`}>
                    <p className={`${colorClasses.text}`}>{value}</p>
                </div>
            );
        } else if (Array.isArray(value)) {
            return value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value?.toString() ?? '-';
    };

    const handleAction = (actionType: string, id: string) => {
        if (actionType === 'View') {
            setIsModalOpen(true)
        } else if (actionType === 'Edit') {
            updateCaseDetails(id)
        }
    };

    const handleModalStatus = () => {
        setIsModalOpen(false)
    }

    return (
        <div>
            {isModalOpen ? <BasicModal isOpen={isModalOpen} handleModal={handleModalStatus} /> : null}
            <div className="overflow-x-auto rounded-md ">
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
                                    <td key={i} className="text-center p-2">
                                        { //@ts-ignore
                                        }{renderCell(row[col], col, row.id)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default DynamicTable;