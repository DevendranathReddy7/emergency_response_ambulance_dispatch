import { useState } from "react"
import { NavLink } from "react-router-dom"


const NavLinks = [
    {
        linkTo: '/add-ambulance',
        LinkName: 'Add Ambulance',
        id: 'add_ambulance'
    },
    {
        linkTo: '/add-user',
        LinkName: 'Add User',
        id: 'add_user'
    },
    {
        linkTo: '/log-emergency',
        LinkName: 'Log Case',
        id: 'add_case'
    }
];

const SideBar = () => {
    const [showModal, setShowModal] = useState<boolean>(false)

    const getModal = () => {
        return (
            <div
                className="fixed z-10 inset-0 overflow-y-auto bg-opacity-50 flex items-center top-20 left-20 right-20 justify-center"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 w-full shadow-xl transform transition-all sm:hidden text-center gap-5 flex flex-col">
                    <div className="flex flex-col justify-center w-[80%] content-center mb-3">
                        <h1>Emergency Response</h1>
                        <div className="absolute top-0 right-0 pt-4 pr-4">
                            <button
                                type="button"
                                className="bg-transparent hover:bg-gray-200 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
                                onClick={() => handleModal(false)}
                            >
                                <span className="sr-only">Close</span>

                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>

                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="text-center gap-5 flex flex-col">
                        {renderLinks()}
                    </div>
                </div>
            </div>)
    }

    const handleModal = (status: boolean) => {
        setShowModal(status)
    }



    // const renderLinks = () => {
    //     return (
    //         <>
    //             <div className="border-white p-2 rounded">
    //                 <NavLink
    //                     to="/log-emergency"
    //                     onClick={() => handleModal(false)}
    //                     className={({ isActive }) =>
    //                         isActive
    //                             ? 'bg-blue-800 text-white p-2 rounded'
    //                             : 'hover:bg-blue-400 hover:text-white  p-2 rounded'
    //                     }
    //                 >
    //                     Log Case
    //                 </NavLink>
    //             </div>

    //             <div className="border-white p-2 rounded">
    //                 <NavLink
    //                     to="/add-user"
    //                     onClick={() => handleModal(false)}
    //                     className={({ isActive }) =>
    //                         isActive
    //                             ? 'bg-blue-800 text-white p-2 rounded'
    //                             : 'hover:bg-blue-400 hover:text-white  p-2 rounded'
    //                     }
    //                 >
    //                     Add User
    //                 </NavLink>
    //             </div>
    //         </ >
    //     )
    // }

    const renderLinks = () => { 
        return (
            <>
                {NavLinks.map((currentNav) => (
                    <div className="border-white p-2 rounded" key={currentNav.id}>
                        <NavLink
                            to={currentNav.linkTo}
                            onClick={() => handleModal(false)}
                            className={({ isActive }) =>
                                isActive
                                    ? 'bg-blue-800 text-white p-2 rounded'
                                    : 'hover:bg-blue-400 hover:text-white p-2 rounded'
                            }
                        >
                            {currentNav.LinkName}
                        </NavLink>
                    </div>
                ))}
            </>
        );
    };

    return (
        <div className="bg-gray-200 flex justify-between p-3 rounded items-center m-3 ">
            <div className="border-white p-2 rounded">
                <NavLink
                    to="/"
                    onClick={() => handleModal(false)}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-blue-800 text-white p-2 rounded'
                            : 'hover:bg-blue-400 hover:text-white  p-2 rounded'
                    }
                >
                    ER System
                </NavLink>
            </div>

            <div>
                <button className="text-3xl sm:hidden cursor-pointer" onClick={() => handleModal(true)}>≡</button>
            </div>

            <div className=" gap-4 hidden sm:flex sm: justify-between">{renderLinks()}</div>

            {showModal && getModal()}
        </div>
    )
}

export default SideBar
