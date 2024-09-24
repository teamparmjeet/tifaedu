"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Phone, MapIcon, Calendar } from "lucide-react"
export default function Page({ params }) {
    const { id } = params;
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get(`/api/queries/find-single-byid/${id}`);
                setQuery(response.data.query);

            } catch (error) {
                console.error("Error fetching branch data:", error);
                setError("Failed to fetch branch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBranchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>

            <div className="grid grid-cols-4 min-h-screen">
                <div className=" col-span-1 h-full  bg-zinc-50 shadow-[#29234b] shadow p-3">
                    <h1 className="text-2xl font-semibold text-[#29234b]">{query.studentName}</h1>
                    <div className="flex flex-col gap-3 my-4">
                        <p className="flex items-center gap-x-2 text-sm text-gray-600">
                            <Phone color="#6cb049" size={20} />
                            {query.studentContact.phoneNumber}
                        </p>
                        <p className="flex items-center gap-x-2 text-sm text-gray-600">
                            <MapIcon color="#6cb049" size={20} />
                            {query.studentContact.address}
                        </p>
                        <p className="flex items-center gap-x-2 text-sm text-gray-600">
                            <Calendar color="#6cb049" size={20} />
                            {`${String(new Date(query.deadline).getDate()).padStart(2, '0')}-${String(new Date(query.deadline).getMonth() + 1).padStart(2, '0')}-${String(new Date(query.deadline).getFullYear()).slice(-2)}`}
                        </p>
                    </div>
                    <p className="text-sm">
                        Assigned To: <span className="font-semibold text-[#29234b]">{query.assignedTo}</span>
                    </p>
                    <div>
                        <h2 className="text-lg font-semibold mt-4 text-[#29234b]">More Info</h2>
                        {/* Additional content for More Info can go here */}
                    </div>


                </div>
                <div className="col-span-3 h-full "></div>
            </div>

        </>
    );
}
