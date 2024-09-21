"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight,Filter } from "lucide-react";

export default function Branchadmin() {
    const [admin, setadmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [adminPerPage] = useState(8);
    const [usertypeFilter, setUsertypeFilter] = useState('all'); // Add state for usertype filter

    useEffect(() => {
        const fetchadminData = async () => {
            try {
                const response = await axios.get('/api/admin/fetchall/admin');
                setadmin(response.data.fetch);
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchadminData();
    }, []);

    const router = useRouter();
    const handleRowClick = (id) => {
        // router.push(`/main/page/admin/${id}`);
    };

    // Pagination logic
    const indexOfLastadmin = currentPage * adminPerPage;
    const indexOfFirstadmin = indexOfLastadmin - adminPerPage;

    // Filter admin data based on usertype
    const filteredAdmin = usertypeFilter === 'all'
        ? admin
        : admin.filter(a => a.usertype === usertypeFilter);

    const currentadmin = filteredAdmin.slice(indexOfFirstadmin, indexOfLastadmin);
    const totalPages = Math.ceil(filteredAdmin.length / adminPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container lg:w-[95%] mx-auto py-5'>
            <div className=" relative flex justify-start mb-4">
                <label htmlFor="branch" className="px-2 absolute h-full flex items-center text-green-500">
                   <Filter size={15}/>
                </label>
                <select
                    value={usertypeFilter}
                    onChange={(e) => setUsertypeFilter(e.target.value)}
                    className="block px-7 py-1 text-gray-500 bg-white border border-gray-200 rounded-md appearance-none placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                >
                    <option value="all">All Users</option>
                    <option value="0">Staff</option>
                    <option value="1">Branch Admin</option>
                    <option value="2">Admin</option>
                </select>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600 font-sans">
                    <thead className="bg-[#6cb049] text-white uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Admin Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Mobile</th>
                            <th scope="col" className="px-6 py-3">Branch</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4">
                                    <div className="flex justify-center items-center h-[300px]">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : currentadmin.length > 0 ? (
                            currentadmin.map((admin) => (
                                <tr
                                    onClick={() => handleRowClick(admin._id)}
                                    key={admin._id}
                                    className={`border-b cursor-pointer hover:bg-gray-100 odd:bg-gray-50 even:bg-gray-100 transition-colors duration-200`}
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                        {admin.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.email}
                                    </td>
                                    <td className="px-6 py-4 truncate">
                                        {admin.mobile}
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.branch}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] text-white font-semibold rounded-2xl ${admin.usertype === "0" ? "bg-yellow-500" :
                                            admin.usertype === "1" ? "bg-[#6cb049]" :
                                                admin.usertype === "2" ? "bg-blue" :
                                                    "bg-unknown"}`}>
                                            {admin.usertype === "0" ? "Staff" :
                                                admin.usertype === "1" ? "Branch Admin" :
                                                    admin.usertype === "2" ? "Admin" :
                                                        "Unknown User Type"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No admin available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                className={`px-3 py-1 mx-1 border rounded ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200' : 'bg-[#6cb049] text-white'}`}
            >
                <ArrowRight size={18} />
            </button>
        </div>
    );
};
