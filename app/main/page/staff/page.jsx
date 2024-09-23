"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Search, Trash2, CirclePlus, Filter, X } from "lucide-react";
import Link from 'next/link';

export default function User() {
    const [userer, setUserer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usererPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState("");
    const [selecteduserer, setSelecteduserer] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [filteruser, setfilteruser] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    useEffect(() => {
        const fetchuserData = async () => {
            try {
                const response = await axios.get('/api/admin/fetchall/admin');
                setUserer(response.data.fetch);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchuserData();
    }, []);

    const router = useRouter();
    const handleRowClick = (id) => {
        // router.push(`/main/page/user/${id}`);
    };
    const toggleFilterPopup = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    // Sort userer based on selected order
    const sortuserer = (userer) => {
        return userer.sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);
        });
    };

    // Filter userer based on course, search term, and status
    const filtereduser = sortuserer(
        userer.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filteruser === "" || user.branch.includes(filteruser)) &&
            (filterStatus === "" || user.usertype.includes(filterStatus)) // Added filter for status field
        )
    );




    // Pagination logic
    const indexOfLastuser = currentPage * usererPerPage;
    const indexOfFirstuser = indexOfLastuser - usererPerPage;
    const currentuserer = filtereduser.slice(indexOfFirstuser, indexOfLastuser);
    const totalPages = Math.ceil(filtereduser.length / usererPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle multi-select for bulk actions
    const handleSelectuser = (id) => {
        if (selecteduserer.includes(id)) {
            setSelecteduserer(selecteduserer.filter(userId => userId !== id));
        } else {
            setSelecteduserer([...selecteduserer, id]);
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        try {
            // Assuming you have a delete API for deleting multiple userer by their IDs
            await axios.post('/api/user/delete', { userIds: selecteduserer });
            setUserer(userer.filter(user => !selecteduserer.includes(user._id)));
            setSelecteduserer([]);
            alert('userer deleted successfully');
        } catch (error) {
            console.error('Error deleting userer:', error);
        }
    };

    return (
        <div className='container lg:w-[95%] mx-auto py-5'>
            {/* Search, Sort, Filter, and Bulk Actions */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={14} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search user"
                        className="border px-3 py-2 pl-10 text-sm focus:outline-none    "
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="lg:hidden text-gray-600 px-3 py-2 border rounded-md" onClick={toggleFilterPopup}>
                    <Filter size={16} />
                </button>

                {/* Popup for Filters on Mobile */}
                {isFilterOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
                        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-4 z-50">
                            <button className="text-gray-600 mb-4" onClick={toggleFilterPopup}>
                                <X size={20} />
                            </button>

                            <div className="flex flex-col space-y-3">
                                <select
                                    className="border px-3 py-2 focus:outline-none text-sm"
                                    value={filteruser}
                                    onChange={(e) => setfilteruser(e.target.value)}
                                >
                                    <option value="">All Branch</option>
                                    {Array.from(new Set(userer.flatMap(user => user.branch))).map((branch, index) => (
                                        <option key={index} value={branch}>{branch}</option>
                                    ))}
                                </select>


                                <select
                                    className="border px-3 py-2 focus:outline-none text-sm"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </select>

                                <Link href={'/main/page/adduser'}>
                                    <button className="bg-[#29234b] rounded-md flex items-center text-white text-sm px-4 py-2">
                                        <CirclePlus size={16} className='me-1' /> Add user
                                    </button>
                                </Link>

                                <button
                                    className="text-red-500 rounded-md border border-red-500 px-3 py-2"
                                    onClick={handleBulkDelete}
                                    disabled={selecteduserer.length === 0}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Filter Section */}
                <div className="hidden lg:flex space-x-3">
                    <select
                        className="border px-3 py-2 focus:outline-none text-sm"
                        value={filteruser}
                        onChange={(e) => setfilteruser(e.target.value)}
                    >
                        <option value="">All Branch</option>
                        {Array.from(new Set(userer.flatMap(user => user.branch))).map((branch, index) => (
                            <option key={index} value={branch}>{branch}</option>
                        ))}
                    </select>

                    <select
                        className="border px-3 py-2 focus:outline-none text-sm"
                        value={sortOrder}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All User</option>
                        <option value="0">User</option>
                        <option value="1">Branch Admin</option>
                    </select>

                    <select
                        className="border px-3 py-2 focus:outline-none text-sm"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <Link href={'/main/page/registerstaff'}>
                        <button className="bg-[#29234b] rounded-md flex items-center text-white text-sm px-4 py-2 ">
                            <CirclePlus size={16} className='me-1' /> Add user
                        </button>
                    </Link>

                    <button
                        className="text-red-500 rounded-md border border-red-500 px-3 py-2"
                        onClick={handleBulkDelete}
                        disabled={selecteduserer.length === 0}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* user Table */}
            <div className="relative overflow-x-auto shadow-md  bg-white   border border-gray-200">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600 font-sans">
                    <thead className="bg-[#29234b] text-white uppercase">
                        <tr>
                            <th scope="col" className="px-4 font-medium capitalize py-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelecteduserer(
                                            e.target.checked
                                                ? userer.map(user => user._id)
                                                : []
                                        )
                                    }
                                    checked={selecteduserer.length === userer.length}
                                />
                            </th>
                            <th scope="col" className="px-4 font-medium capitalize py-2">User Name</th>
                            <th scope="col" className="px-4 font-medium capitalize py-2">Email</th>
                            <th scope="col" className="px-4 font-medium capitalize py-2">Mobile</th>
                            <th scope="col" className="px-4 font-medium capitalize py-2">Branch</th>
                            <th scope="col" className="px-4 font-medium capitalize py-2">Roll</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4">
                                    <div className="flex justify-center items-center h-[300px]">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : currentuserer.length > 0 ? (
                            currentuserer.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className={`border-b cursor-pointer hover:bg-gray-100 odd:bg-gray-50 even:bg-gray-100 transition-colors duration-200`}
                                >
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selecteduserer.includes(user._id)}
                                            onChange={() => handleSelectuser(user._id)}
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-2 font-semibold text-gray-900 text-sm whitespace-nowrap"
                                        onClick={() => handleRowClick(user._id)}
                                    >
                                        {user.name}

                                    </td>
                                    <td className="px-4 py-2 text-[12px]">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-2 truncate text-[12px]">
                                        {user.mobile}

                                    </td>
                                    <td className="px-4 py-2 text-[12px]">
                                        {user.branch}

                                    </td>
                                    <td className="px-4 py-2 text-[12px]">
                                        {user.usertype}

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No userer available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            </div>
        </div>
    );
}

const Pagination = ({ currentPage, totalPages, paginate }) => {
    return (
        <div className="flex justify-center my-4">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 text-sm border rounded ${currentPage === 1 ? 'cursor-not-allowed bg-gray-200' : 'bg-[#6cb049] text-white'}`}
            >
                <ArrowLeft size={18} />
            </button>

            <span className="px-3 py-1 mx-1 text-sm border rounded bg-gray-200">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 text-sm border rounded ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200' : 'bg-[#6cb049] text-white'}`}
            >
                <ArrowRight size={18} />
            </button>
        </div>
    );
};
