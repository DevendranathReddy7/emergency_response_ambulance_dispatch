import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavLinks = [
    {
        type: 'dropdown',
        mainLinkName: 'Ambulance',
        id: 'ambulance_dropdown',
        dropdownItems: [
            {
                linkTo: '/add-ambulance',
                LinkName: 'Add Ambulance',
                id: 'add_ambulance'
            },
            {
                linkTo: '/view-ambulance',
                LinkName: 'View Ambulance'
            }
        ]
    },
    {
        type: 'dropdown',
        mainLinkName: 'Users',
        id: 'users_dropdown',
        dropdownItems: [
            {
                linkTo: '/add-user',
                LinkName: 'Add User',
                id: 'add_user'
            },
            {
                linkTo: '/view-user',
                LinkName: 'View User',
                id: 'View_user'
            }
        ]
    },
    {
        type: 'dropdown',
        mainLinkName: 'Cases',
        id: 'cases_dropdown',
        dropdownItems: [
            {
                linkTo: '/log-emergency',
                LinkName: 'Log Case',
                id: 'log_case'
            },
            {
                linkTo: '/',
                LinkName: 'View Cases',
                id: 'view_cases'
            }
        ]
    },
];

const SideBar = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleModal = (status: boolean) => {
        setShowModal(status);
        if (!status) {
            setOpenDropdown(null);
        }
    };

    const handleDropdownToggle = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const renderLinks = (isMobileMenu: boolean = false) => {
        return (
            <>
                {NavLinks.map((navItem) => (
                    <div key={navItem.id} className="relative">
                        <div
                            className={`
                                border-white p-2 rounded
                                ${isMobileMenu ? '' : 'group'}
                                ${openDropdown === navItem.id && isMobileMenu ? 'bg-blue-800 text-white' : ''}
                            `}
                            onMouseEnter={() => !isMobileMenu && setOpenDropdown(navItem.id)}
                            onMouseLeave={() => !isMobileMenu && setOpenDropdown(null)}
                            onClick={() => isMobileMenu && handleDropdownToggle(navItem.id)}
                        >
                            <button className="flex items-center justify-between w-full text-white p-2 rounded bg-blue-800 hover:bg-blue-400 focus:outline-none">
                                {navItem.mainLinkName}
                                <svg
                                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${openDropdown === navItem.id ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            <div
                                className={`
                                    ${isMobileMenu ? '' : 'absolute hidden group-hover:block'}
                                    ${openDropdown === navItem.id && isMobileMenu ? 'block' : 'hidden'}
                                    ${isMobileMenu ? 'relative ml-4 mt-2' : 'right-0 mt-2 bg-white shadow-lg rounded-md w-48 py-1 z-20'}
                                `}
                            >
                                {navItem.dropdownItems.map((dropdownItem) => (
                                    <NavLink
                                        key={dropdownItem.id}
                                        to={dropdownItem.linkTo}
                                        onClick={() => {
                                            if (isMobileMenu) handleModal(false);
                                            setOpenDropdown(null);
                                        }}
                                        className={({ isActive }) =>
                                            `block px-4 py-2 text-sm
                                            ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`
                                        }
                                    >
                                        {dropdownItem.LinkName}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const getModal = () => {
        return (
            <div
                className="fixed z-50 inset-0 flex items-center justify-center p-4"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <div className="relative bg-white rounded-lg p-6 w-full max-w-sm shadow-xl transform transition-all text-center flex flex-col gap-5">
                    <div className="flex justify-between items-center mb-3">
                        <h1 className="text-xl font-semibold text-gray-800">Emergency Response</h1>
                        <button
                            type="button"
                            className="bg-transparent hover:bg-gray-200 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer"
                            onClick={() => handleModal(false)}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="text-center flex flex-col gap-3">
                        {renderLinks(true)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center m-3 rounded-lg p-3 shadow-md bg-white">
            <div className="border-white p-2 rounded">
                <NavLink
                    to="/"
                    onClick={() => handleModal(false)}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-blue-800 text-white p-2 rounded'
                            : 'hover:bg-blue-400 hover:text-white p-2 rounded'
                    }
                >
                    ER System
                </NavLink>
            </div>

            <div className="sm:hidden">
                <button className="text-3xl cursor-pointer" onClick={() => handleModal(true)}>
                    ≡
                </button>
            </div>

            <div className="hidden sm:flex gap-4 justify-between">
                {renderLinks(false)}
            </div>

            {showModal && getModal()}
        </div>
    );
};

export default SideBar;