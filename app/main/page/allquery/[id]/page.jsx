"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { Phone, MapPin, Calendar, CheckCircle, MessageCircle } from "lucide-react";
import UpdateQuere from "@/app/main/component/Updatequere/UpdateQuere";
import AssignedQuery from "@/components/AssignedQuery/AssignedQuery";
import QueryHistory from "@/components/QueryHistory/QueryHistory";
import Link from "next/link";
export default function Page({ params }) {
    const { id } = params;

    const [query, setQuery] = useState(null);
    const [loadingQuery, setLoadingQuery] = useState(true);  // Loading state for query data
    const [loadingCourses, setLoadingCourses] = useState(true);  // Loading state for course data
    const [errorQuery, setErrorQuery] = useState(null);  // Error state for query data
    const [errorCourses, setErrorCourses] = useState(null);  // Error state for course data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allCourses, setAllCourses] = useState([]);

    // Fetch query data
    const fetchBranchData = useCallback(async () => {
        try {
            setLoadingQuery(true);
            const response = await axios.get(`/api/queries/find-single-byid/${id}`);
            setQuery(response.data.query);
            setErrorQuery(null);  // Clear any previous errors
        } catch (error) {
            console.error("Error fetching branch data:", error);
            setErrorQuery("Failed to fetch branch data.");
        } finally {
            setLoadingQuery(false);
        }
    }, [id]);

    // Fetch course data
    const fetchCourseData = useCallback(async () => {
        try {
            setLoadingCourses(true);
            const courseResponse = await axios.get("/api/course/fetchall/courses");
            setAllCourses(courseResponse.data.fetch || []);
            setErrorCourses(null);  // Clear any previous errors
        } catch (error) {
            console.error("Error fetching course data:", error);
            setErrorCourses("Failed to fetch course data.");
        } finally {
            setLoadingCourses(false);
        }
    }, []);

    useEffect(() => {
        fetchBranchData();
        fetchCourseData();
    }, [fetchBranchData, fetchCourseData]);

    // Show loader when either query or course data is loading
    if (loadingQuery || loadingCourses) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
                <Loader />
            </div>
        );
    }

    // Display error if either fetch has an issue
    if (errorQuery || errorCourses) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen bg-gray-50">
                <p className="text-red-500 text-lg">
                    {errorQuery || errorCourses}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 bg-gray-50 min-h-screen">
            {/* Left Sidebar */}
            <div className="col-span-1">
                <div className="sticky top-8">
                    <button onClick={() => setIsModalOpen(true)} className="mb-2 bg-[#29234b] w-full py-2 rounded-md text-white">
                        Update
                    </button>
                    <h1 className="text-xl font-bold text-[#29234b] mb-3 hover:underline cursor-pointer">
                        {query.studentName}
                    </h1>
                    <div className="flex flex-col text-sm text-gray-700 ">
                        <Link
                            href={`tel:${query.studentContact.phoneNumber}`}
                            title={`Call ${query.studentName} at ${query.studentContact.phoneNumber}`}
                            className="flex items-center gap-x-2 p-0.5 my-1 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            <Phone color="#6cb049" size={18} />
                            {query.studentContact.phoneNumber}
                        </Link>


                        <Link
                            href={`https://wa.me/${query.studentContact.whatsappNumber}`}
                            passHref
                            title={`Message ${query.studentName} on WhatsApp`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-x-2 p-0.5 my-1 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            <MessageCircle color="#6cb049" size={18} />
                            {query.studentContact.whatsappNumber}

                        </Link>

                        <p className="flex items-center gap-x-2 p-0.5 my-1 rounded-lg hover:bg-gray-100 transition duration-200">
                            <MapPin color="#6cb049" size={18} />
                            {query.studentContact.city}
                        </p>
                        <p className="flex items-center gap-x-2 p-0.5 my-1 rounded-lg hover:bg-gray-100 transition duration-200">
                            <MapPin color="#6cb049" size={18} />
                            {query.studentContact.address}
                        </p>
                        <p className="flex items-center gap-x-2 p-0.5 my-1 rounded-lg hover:bg-gray-100 transition duration-200">
                            <Calendar color="#6cb049" size={18} />
                            {`${String(new Date(query.deadline).getDate()).padStart(2, "0")}-${String(new Date(query.deadline).getMonth() + 1).padStart(2, "0")}-${String(new Date(query.deadline).getFullYear()).slice(-2)}`}
                        </p>
                    </div>
                    <p className="mt-4 text-sm">
                        <AssignedQuery refreshData={fetchBranchData} initialData={query} />
                    </p>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b]">Course Interest</h2>
                        <p className="text-sm text-gray-700">
                            {allCourses.find(course => course._id === query.courseInterest)
                                ? allCourses.find(course => course._id === query.courseInterest).course_name
                                : query.courseInterest}
                        </p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b]">Enrolled Status</h2>
                        <p className="text-sm text-gray-700">{query.addmission ? "Enrolled" : "Not Enrolled"}</p>
                    </div>
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold text-[#29234b]">Query Status</h2>
                        <p className="text-sm text-gray-700 capitalize">{query.autoclosed}</p>
                    </div>

                </div>
            </div>

            {/* Right Section */}
            <div className="col-span-3 bg-white shadow-md rounded-lg p-5">
                {/* History Timeline */}
                <div className="space-y-6">
                    <QueryHistory initialData={query} />
                </div>
            </div>

            <UpdateQuere refreshData={fetchBranchData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={query} />
        </div>
    );
}
