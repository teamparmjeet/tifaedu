"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Input from '@/components/input/Input';
import toast, { Toaster } from 'react-hot-toast';
import { Book, Loader2, Trash } from "lucide-react";
import 'react-phone-input-2/lib/style.css';

export default function Page() {
    const [formData, setFormData] = useState({
        referencename: '',
    });

    const [loading, setLoading] = useState(false);
    const [referenceData, setReferenceData] = useState([]);
    const [fetching, setFetching] = useState(true); // For loading state when fetching data

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Fetch references from API
    const fetchReferences = async () => {
        setFetching(true); // Set fetching state to true
        try {
            const response = await axios.get('/api/reference/fetchall/reference');
            setReferenceData(response.data.fetch);
        } catch (error) {
            toast.error("Error fetching reference data");
        } finally {
            setFetching(false); // Turn off loading state
        }
    };

    useEffect(() => {
        fetchReferences(); // Fetch all references when the component mounts
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submit to create a reference
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/reference/create', formData);
            toast.success('Reference created successfully');

            // Reset form data
            setFormData({
                referencename: '',
            });

            // Refetch the updated reference data
            fetchReferences();

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error in creating reference';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete reference
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this reference?")) {
          try {
            const response = await axios.delete(`/api/reference/delete/${id}`);
      
            if (response.data.success) {
              toast.success("Reference deleted successfully");
              fetchReferences(); // Refetch references after deletion
            } else {
              toast.error(response.data.message || "Error deleting reference");
            }
          } catch (error) {
            toast.error("Error deleting reference");
          }
        }
      };
      
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = referenceData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(referenceData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 border ${i === currentPage ? 'bg-[#6cb049] text-white' : 'bg-white text-gray-600'} hover:bg-[#57a23e] mx-1`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <>
            <div className="px-4 py-5 md:px-10 md:py-5">
                <Toaster />
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Left side - Table */}
                    <div className="lg:w-2/3 bg-white shadow-lg border border-gray-200 p-5">
                        <h2 className="text-lg font-bold mb-4">All References</h2>

                        {/* Show loader while fetching */}
                        {fetching ? (
                            <div className="flex justify-center items-center h-32">
                                <Loader2 className="animate-spin" size={35} />
                            </div>
                        ) : (
                            <>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#f3f4f6] text-sm">
                                            <th className="border p-2">#</th>
                                            <th className="border p-2">Reference Name</th>
                                            <th className="border p-2">Created At</th>
                                            <th className="border p-2 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.length > 0 ? (
                                            currentData.map((reference, index) => (
                                                <tr key={reference.id} className="text-sm">
                                                    <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                                                    <td className="border p-2">{reference.referencename}</td>
                                                    <td className="border p-2">{new Date(reference.createdAt).toLocaleDateString()}</td>
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleDelete(reference._id)}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="border p-2 text-center">
                                                    No references found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination controls */}
                                <div className="mt-4 flex justify-center">
                                    {renderPaginationButtons()}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right side - Form */}
                    <div className="lg:w-1/3 bg-white shadow-lg border border-gray-200">
                        <div className="bg-[#29234b] text-white px-7 py-3 flex justify-between w-full">
                            <h1 className="text-lg font-bold">Add Reference</h1>
                        </div>
                        <form className="px-5 py-3 space-y-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <div className='relative'>
                                    <Input
                                        placeholder="Enter Reference Name"
                                        type="text"
                                        id="referencename"
                                        name="referencename"
                                        value={formData.referencename}
                                        onChange={handleInputChange}
                                        icon={<Book size={15} />}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className={`w-full text-white bg-[#6cb049] py-3 px-5 rounded-md hover:bg-[#57a23e] ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Register Reference'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
