"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from 'next-auth/react';

export default function Page() {
    const [branches, setBranches] = useState([]);
    const [allCourses, setAllCourses] = useState([]); // Store all courses

    const [adminData, setAdminData] = useState(null);
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        userid: "",
        studentName: "",
        studentContact: {
            phoneNumber: "",
            address: "",
        },
        courseInterest: "",
        deadline: "",
        branch: "",
        notes: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const today = new Date().toISOString().split('T')[0];


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                const courseResponse = await axios.get("/api/course/fetchall/courses");
                setAllCourses(courseResponse.data.fetch || []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);  // Start loading
                const response = await axios.get(
                    `/api/admin/find-admin-byemail/${session?.user?.email}`
                );
                const adminBranch = response.data;
                setAdminData(adminBranch);

                // Update the formData with the fetched admin branch
                setFormData((prevFormData) => ({
                    ...prevFormData,

                    userid: adminBranch._id,
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);  // Stop loading
            }
        };

        if (session?.user?.email) fetchAdminData();
    }, [session]);





    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const response = await axios.get('/api/branch/fetchall/branch');
                setBranches(response.data.fetch);
            } catch (error) {
                console.error('Error fetching branch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranchData();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes("studentContact.")) {
            setFormData({
                ...formData,
                studentContact: {
                    ...formData.studentContact,
                    [name.split(".")[1]]: value,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };




    useEffect(() => {
        const isFormFilled =

            formData.studentName &&
            formData.studentContact.phoneNumber &&
            formData.studentContact.address &&
            formData.courseInterest &&
            formData.deadline &&
            formData.branch &&
            formData.notes;

        setIsFormValid(isFormFilled);
    }, [formData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {

            const response = await axios.post("/api/queries/add", formData);
            if (response.status === 200) {
                setSuccess("Query successfully Added!");
                toast.success("Query successfully Added!")
                window.location.reload();
                setFormData({
                    userid: adminData._id,
                    studentName: "",
                    studentContact: {
                        phoneNumber: "",
                        address: "",
                    },
                    courseInterest: "",
                    deadline: "",
                    branch: "",
                    notes: ""
                });
            }
        } catch (err) {
            setError("Failed to Add Query. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container lg:w-[90%] mx-auto py-5">
            <Toaster />
            <div className="bg-white shadow-lg   overflow-hidden border border-gray-200">
                <div className="bg-[#29234b] text-white px-7 py-3 flex justify-between w-full">
                    <h1 className="text-lg font-bold">Add New Query</h1>
                </div>


                {/* {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>} */}

                <form onSubmit={handleSubmit} className="px-5 py-3 space-y-3">

                    <div className="grid grid-cols-12 gap-4">
                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="studentName" className="block text-[12px] text-gray-700">
                                Student Name
                            </label>
                            <input
                                type="text"
                                name="studentName"
                                placeholder="Enter Student Name"
                                value={formData.studentName}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div>


                        <div className="sm:col-span-6 col-span-12">
                            <label className="block text-[12px] text-gray-700">Phone Number</label>
                            <PhoneInput
                                country={"in"}
                                value={formData.studentContact.phoneNumber}
                                onChange={(phone) =>
                                    setFormData({
                                        ...formData,
                                        studentContact: { ...formData.studentContact, phoneNumber: phone },
                                    })
                                }
                                className="w-full rounded-0"
                            />
                        </div>

                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="courseInterest" className="block text-[12px] text-gray-700">
                                Course Interest
                            </label>
                            <select name="courseInterest" value={formData.courseInterest} id="" onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                <option value="" disabled selected>Select Course</option>
                                {allCourses.map((allCourses, index) => (
                                    <option key={index} value={allCourses._id}>{allCourses.course_name}</option>
                                ))}
                            </select>

                        </div>
                        {/* <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="courseInterest" className="block text-[12px] text-gray-700">
                                Course Interest
                            </label>
                            <input
                                type="text"
                                name="courseInterest"
                                placeholder="Enter Course Name"
                                value={formData.courseInterest}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div> */}
                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="studentContact.address" className="block text-[12px] text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="studentContact.address"
                                placeholder="Enter Address"
                                value={formData.studentContact.address}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div>


                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="deadline" className="block text-[12px] text-gray-700">
                                DeadLine
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                placeholder="Enter Address"
                                value={formData.deadline}
                                onChange={handleChange}
                                min={today}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div>

                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="branch" className="block text-[12px] text-gray-700">
                                Branch
                            </label>
                            <select name="branch" value={formData.branch} id="" onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                <option value="" disabled selected>Select Branch</option>
                                {branches.map((branch, index) => (
                                    <option key={index} value={branch.branch_name}>{branch.branch_name}</option>
                                ))}
                            </select>

                        </div>



                        <div className="col-span-12">
                            <label htmlFor="notes" className="block text-[12px] text-gray-700">
                                Notes
                            </label>
                            <textarea
                                type="text"
                                name="notes"
                                placeholder="Write Note"
                                value={formData.notes}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div>



                    </div>



                    {/* Submit button */}
                    <div>
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            className={`${!isFormValid || loading ? "bg-gray-400" : "bg-[#6cb049]"
                                } text-white w-full font-bold py-2 px-4 rounded-md`}
                        >
                            {loading ? "Submitting..." : "Add Query"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
