"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { Phone, MapPin, Calendar, CheckCircle } from "lucide-react";
import UpdateQuere from "@/app/main/component/Updatequere/UpdateQuere";

export default function Page({ params }) {
    const { id } = params;
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  
    const fetchBranchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/queries/find-single-byid/${id}`);
            setQuery(response.data.query);
        } catch (error) {
            console.error("Error fetching branch data:", error);
            setError("Failed to fetch branch data.");
        } finally {
            setLoading(false);
        }
    }, [id]);
    
    useEffect(() => {
        fetchBranchData();
    }, [fetchBranchData]);
    

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    // Sort the history by date in descending order (latest first)
    const sortedHistory = query.history
        ? [...query.history].sort((a, b) => new Date(b.actionDate) - new Date(a.actionDate))
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-gray-50 min-h-screen">
            {/* Left Sidebar */}
            <div className="col-span-1 bg-white shadow-lg rounded-lg p-6 ">
                <div className="sticky top-5">
                  
                    <h1 className="text-xl font-bold text-[#29234b] mb-3 hover:underline cursor-pointer">{query.studentName}</h1>
                    <div className="flex flex-col  text-sm text-gray-700">
                        <p className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                            <Phone color="#6cb049" size={18} />
                            {query.studentContact.phoneNumber}
                        </p>
                        <p className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                            <MapPin color="#6cb049" size={18} />
                            {query.studentContact.address}
                        </p>
                        <p className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
                            <Calendar color="#6cb049" size={18} />
                            {`${String(new Date(query.deadline).getDate()).padStart(2, "0")}-${String(new Date(query.deadline).getMonth() + 1).padStart(2, "0")}-${String(new Date(query.deadline).getFullYear()).slice(-2)}`}
                        </p>
                    </div>
                    <p className="mt-4 text-sm">
                        <span className="font-semibold">Assigned To:</span> {query.assignedTo}
                    </p>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b]">Course Interest</h2>
                        <p className="text-sm text-gray-700">{query.courseInterest}</p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b] mb-2">Stage</h2>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Call Stage:</span> {query.callStage}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Connection Status:</span> {query.connectionStatus}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Lead Status:</span> {query.leadStatus}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b]">More Info</h2>
                        <p className="text-sm text-gray-700">Additional information can go here.</p>
                    </div>

                    <button onClick={() => setIsModalOpen(true)}  className=" mt-4 bg-[#29234b] w-full py-2 rounded-md text-white">Update</button>
                </div>
            </div>


            {/* Right Section */}
            <div className="col-span-3 bg-white shadow-md rounded-lg p-5">
                <h2 className="text-lg font-bold text-[#29234b] mb-3">Latest Activities</h2>

                {/* History Timeline */}
                <div className="space-y-6">
                    {sortedHistory.length > 0 ? (
                        sortedHistory.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start p-6 bg-gradient-to-r from-gray-100 to-white shadow-lg rounded-lg border border-gray-300"
                            >
                                <div className="flex-shrink-0">
                                    <CheckCircle color="#6cb049" size={24} />
                                </div>
                                <div className="ml-4 flex-grow">
                                    <p className="text-lg font-bold text-gray-800 hover:text-[#6cb049] transition-colors">
                                        {item.actionBy} updated {query.studentName}&apos;s query
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Created on{" "}
                                        {`${String(new Date(query.createdAt).getDate()).padStart(2, "0")}-${String(
                                            new Date(query.createdAt).getMonth() + 1
                                        ).padStart(2, "0")}-${String(new Date(query.createdAt).getFullYear()).slice(-2)}`}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        <span className="font-medium text-gray-600 mr-2">Updated At:</span>
                                        <span className="text-gray-800">{new Date(item.actionDate).toLocaleString()}</span>
                                    </p>

                                    {/* Check if there are changes and render them */}
                                    {item.changes && Object.keys(item.changes).length > 0 && (
                                        <div className="mt-3 overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                                            <table className="min-w-full text-xs bg-gray-50 rounded-lg">
                                                {/* <thead>
                                                    <tr className="bg-gray-200 text-gray-700">
                                                        <th className="px-4 py-2 text-left rounded-tl-lg rounded-tr-lg">Field</th>
                                                        <th className="px-4 py-2 text-left">Old Value</th>
                                                        <th className="px-4 py-2 text-left rounded-tl-lg rounded-tr-lg">New Value</th>
                                                    </tr>
                                                </thead> */}
                                                <tbody>
                                                    {Object.entries(item.changes).map(([key, { oldValue, newValue }]) => (
                                                        newValue && (
                                                            <tr key={key} className="border-b hover:bg-gray-100 transition-colors">
                                                                <td className="px-4 py-2 text-gray-600 font-medium">
                                                                    {key}
                                                                </td>
                                                                <td className="px-4 py-2 text-red-600">{oldValue}</td>
                                                                <td className="px-4 py-2 text-[#6cb049] font-semibold">→ {newValue}</td>
                                                            </tr>
                                                        )
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center">No activities recorded yet.</p>
                    )}
                </div>

            </div>
            <UpdateQuere refreshData={fetchBranchData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={query} />
        </div>
    );
}
