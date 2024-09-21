"use client";
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { User, Mail, Phone, Shield } from "lucide-react"
import Image from 'next/image';
export default function Page() {
    const { data: session } = useSession();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (session?.user?.email) {
                try {
                    const response = await axios.get(`/api/admin/find-admin-byemail/${session.user.email}`);
                    setAdminData(response.data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [session]);

    if (loading) {
        return <div className='flex justify-center'><Loader /></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="container lg:w-[90%] mx-auto py-5">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-[#6cb049] text-white p-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <button
                        className="bg-white text-[#6cb049] font-semibold px-4 py-2 rounded shadow hover:bg-gray-100"
                        onClick={() => signOut()}
                    >
                        Sign Out
                    </button>
                </div>
                <div className=" grid sm:grid-cols-2 p-4 items-center">
                    <div className="sm:col-span-1 ">

                        {adminData && (
                            <div className="">
                                <p className="text-gray-800 border-b py-4 flex gap-x-2 items-center"><User size={18} className='text-[#6cb049]' />{adminData.name}</p>
                                <p className="text-gray-800 border-b py-4 flex gap-x-2 items-center"><Phone size={18} className='text-[#6cb049]' />{adminData.mobile}</p>
                                <p className="text-gray-800 border-b py-4 flex gap-x-2 items-center"><Mail size={18} className='text-[#6cb049]' />{adminData.email}</p>
                                <p className="text-gray-800 border-b py-4 flex gap-x-2 items-center"><Shield size={18} className='text-[#6cb049]' />{adminData.usertype === "2" ? 'Tifa Admin' : adminData.usertype === "1" ? `Branch Admin ${adminData.branch}` : adminData.usertype === "0" ? `Staff at ${adminData.branch}` : 'Unknown'}</p>

                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-1 hidden sm:block">
                        <Image src="/image/profile/tifaindia_logo.webp" alt='' width={533} height={282}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
