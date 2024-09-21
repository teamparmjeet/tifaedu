"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/navigation';
import {ArrowLeft,ArrowRight} from "lucide-react"
export default function Branch() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [branchesPerPage] = useState(8);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get('/api/branch/fetchall/branch');
                const sortedBranches = response.data.fetch.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setBranches(sortedBranches);
            } catch (error) {
                console.error('Error fetching branch data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBranchData();
    }, []);
    

    const router = useRouter();
    const handleRowClick = (id) => {
        router.push(`/main/page/branch/${id}`);
    };

    // Pagination logic
    const indexOfLastBranch = currentPage * branchesPerPage;
    const indexOfFirstBranch = indexOfLastBranch - branchesPerPage;
    const currentBranches = branches.slice(indexOfFirstBranch, indexOfLastBranch);
    const totalPages = Math.ceil(branches.length / branchesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container lg:w-[95%] mx-auto py-5'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600 font-sans">
                    <thead className="bg-[#6cb049] text-white uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Branch Name</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Courses Offered</th>
                            <th scope="col" className="px-6 py-3">Student Count</th>
                            <th scope="col" className="px-6 py-3">Staff Count</th>
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
                        ) : currentBranches.length > 0 ? (
                            currentBranches.map((branch, index) => (
                                <tr
                                    onClick={() => handleRowClick(branch._id)}
                                    key={branch._id}
                                    className={`border-b cursor-pointer hover:bg-gray-100 odd:bg-gray-50 even:bg-gray-100 transition-colors duration-200`}
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                        {branch.branch_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {branch.location.street}, {branch.location.city}, {branch.location.state}, {branch.location.zipCode}
                                    </td>
                                    <td className="px-6 py-4 truncate">
                                        {branch.courses.length > 0 ? branch.courses[0] : 'No courses'}...
                                    </td>
                                    <td className="px-6 py-4">{branch.student_count}</td>
                                    <td className="px-6 py-4">{branch.staff_count}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No branches available
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
                <ArrowLeft size={18}/>
            </button>

            <span className="px-3 py-1 mx-1 text-sm border rounded bg-gray-200">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 border rounded ${currentPage === totalPages ? 'cursor-not-allowed bg-gray-200' : 'bg-[#6cb049] text-white'}`}
            >
                <ArrowRight size={18}/>
            </button>
        </div>
    );
};
