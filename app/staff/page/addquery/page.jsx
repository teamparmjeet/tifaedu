"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from 'next-auth/react';
import { Citylist } from "@/constants/City";


export default function Page() {
    const [adminData, setAdminData] = useState(null);
    const [allCourses, setAllCourses] = useState([]); // Store all courses
    const [referenceData, setReferenceData] = useState([]);
    const [displayDate, setDisplayDate] = useState("");
    const [user, setuser] = useState([]);

    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        userid: "",
        studentName: "",
        referenceid: "",

        studentContact: {
            phoneNumber: "",
            whatsappNumber: "",
            address: "",
            city: "Jaipur"
        },
        courseInterest: "",
        deadline: "",
        branch: "",
        notes: "",


        qualification: "",
        profession: "",
        professiontype: "null",
        reference_name: "null"

    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    // const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    const sessionStart = new Date(currentYear, 2, 1); // March 1 of the current year
    const sessionEnd = new Date(currentYear + 1, 2, 31); // March 31 of the next year
    const formatDate = (date) => date.toISOString().split('T')[0];

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
                    branch: adminBranch.branch,
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

    const fetchReferences = async () => {
        setLoading(true); // Set fetching state to true
        try {
            const response = await axios.get('/api/reference/fetchall/reference');
            setReferenceData(response.data.fetch);
        } catch (error) {
            toast.error("Error fetching reference data");
        } finally {
            setLoading(false); // Turn off loading state
        }
    };

    useEffect(() => {
        fetchReferences(); // Fetch all references when the component mounts
    }, []);


    useEffect(() => {
        const fetchuserData = async () => {
            try {
                const response = await axios.get('/api/admin/fetchall/admin');
                setuser(response.data.fetch);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchuserData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "deadline") {
            // Format the date for display
            const formattedDate = new Date(value).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
            setDisplayDate(formattedDate);
            setFormData({ ...formData, [name]: value });
        } else if (name.includes("studentContact.")) {
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
            formData.referenceid &&
            formData.studentContact.phoneNumber &&
            formData.studentContact.whatsappNumber &&
            formData.studentContact.address &&
            formData.studentContact.city &&
            formData.courseInterest &&
            formData.deadline &&
            formData.notes &&
            formData.qualification &&
            formData.profession
        // formData.professiontype 
        // formData.reference_name

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
                    referenceid:"",
                    studentName: "",
                    studentContact: {
                        phoneNumber: "",
                        whatsappNumber: "",
                        address: "",
                        city: ""
                    },
                    courseInterest: "",
                    deadline: "",
                    branch: adminData.branch,
                    notes: "",


                    
                    qualification: "",
                    profession: "",
                    professiontype: "",
                    reference_name: ""
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
                            <label htmlFor="studentName" className="block text-[15px] text-gray-700">
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
                            <label className="block text-[15px] text-gray-700">Phone Number</label>
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
                            <label className="block text-[15px] text-gray-700">Whatsapp Number</label>
                            <PhoneInput
                                country={"in"}
                                value={formData.studentContact.whatsappNumber}
                                onChange={(phone) =>
                                    setFormData({
                                        ...formData,
                                        studentContact: { ...formData.studentContact, whatsappNumber: phone },
                                    })
                                }
                                className="w-full rounded-0"
                            />
                        </div>
                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="qualification" className="block text-[15px] text-gray-700">
                                Qualification
                            </label>
                            <input
                                type="text"
                                name="qualification"
                                placeholder="Enter Qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            />
                        </div>


                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="profession" className="block text-[15px] text-gray-700">
                                Profession
                            </label>
                            <select
                                name="profession"
                                value={formData.profession}
                                onChange={handleChange}
                                className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                            >
                                <option value="" disabled>Select Profession</option>
                                <option value="Student">Student</option>
                                <option value="Working">Working</option>
                            </select>
                        </div>

                        {formData.profession === 'Working' && (
                            <div className="sm:col-span-6 col-span-12">
                                <label htmlFor="professiontype" className="block text-[15px] text-gray-700">
                                    Work
                                </label>
                                <input
                                    type="text"
                                    name="professiontype"
                                    placeholder="Enter work type"
                                    value={formData.professiontype}
                                    onChange={handleChange}
                                    className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                                />
                            </div>
                        )}



                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="courseInterest" className="block text-[15px] text-gray-700">
                                Course Interest
                            </label>
                            <select name="courseInterest" value={formData.courseInterest} id="" onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                <option value="" disabled selected>Select Course</option>
                                {allCourses.map((allCourses, index) => (
                                    <option key={index} value={allCourses._id}>{allCourses.course_name}</option>
                                ))}
                            </select>

                        </div>
                        {formData.studentContact.city === 'Jaipur' ? (
                            <div className="sm:col-span-6 col-span-12">
                                <label htmlFor="city" className="block text-[15px] text-gray-700">
                                    City
                                </label>
                                <select name="studentContact.city" value={formData.studentContact.city} onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                    <option value="" disabled selected>Select City</option>
                                    <option value="Jaipur" >Jaipur</option>
                                    <option value="Out of Jaipur" >Out of Jaipur</option>

                                </select>

                            </div>

                        ) : (

                            <div className="sm:col-span-6 col-span-12">
                                <label htmlFor="city" className="block text-[15px] text-gray-700">
                                    City
                                </label>
                                <select name="studentContact.city" value={formData.studentContact.city} onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                    <option value="" disabled selected>Select City</option>
                                    {Citylist.map((stateItem, index) =>
                                        stateItem.cities.map((city, cityIndex) => (
                                            <option key={cityIndex} value={city}>
                                                {city}
                                            </option>
                                        ))
                                    )}
                                </select>

                            </div>
                        )}



                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="studentContact.address" className="block text-[15px] text-gray-700">
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
                            <label htmlFor="deadline" className="block text-[15px] text-gray-700">
                                Deadline
                            </label>
                            <div className=" relative">
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    min={formatDate(sessionStart)}
                                    max={formatDate(sessionEnd)}
                                    className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
                                />
                                <span className="absolute top-0 left-0  bottom-0 flex items-center justify-center px-2 py-2 text-gray-500 bg-white border border-r-0  text-sm">
                                    {displayDate ? displayDate : " select deadline"}
                                </span>
                            </div>
                        </div>





                        <div className="sm:col-span-6 col-span-12">
                            <label htmlFor="referenceid" className="block text-[15px] text-gray-700">
                                Reference Type
                            </label>
                            <select name="referenceid" value={formData.referenceid} id="" onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                <option value="" disabled selected>Select Reference</option>
                                {referenceData.map((data, index) => (
                                    <option key={index} value={data.referencename}>{data.referencename}</option>
                                ))}
                            </select>

                        </div>

                        
                        {formData.referenceid === 'Ofline' && (
                            <div className="sm:col-span-6 col-span-12">
                                <label htmlFor="reference_name" className="block text-[15px] text-gray-700">
                                    Reference Name
                                </label>
                                <select name="reference_name" value={formData.reference_name} id="" onChange={handleChange} className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200  placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm">
                                    <option value="" disabled selected>Select Reference name</option>
                                    <option value={adminData.name}>Self</option>
                                    {user.map((user,index) => (
                                        <option key={index} value={user.name}>{user.name}</option>
                                    ))}
                                </select>

                            </div>
                        )}

                        <div className="col-span-12">
                            <label htmlFor="notes" className="block text-[15px] text-gray-700">
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
