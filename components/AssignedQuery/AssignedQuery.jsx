import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignedQuery({ initialData ,refreshData}) {
    const [assignedTo, setAssignedTo] = useState(initialData.assignedTo);
    const [assignedUserDetails, setAssignedUserDetails] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/admin/fetchall/admin');
                setUsers(response.data.fetch);
                setFilteredUsers(response.data.fetch);

                const matchedUser = response.data.fetch.find(user => user._id === initialData.assignedTo);
                if (matchedUser) {
                    setAssignedUserDetails(matchedUser);
                } else {
                    setAssignedUserDetails(null);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [initialData.assignedTo]);

    const handleUpdate = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.patch('/api/queries/update', {
                id: initialData._id,
                assignedTo,
                actionBy: 'Tifa Admin'
            });

            if (response.status === 200) {
                const updatedUser = users.find(user => user._id === assignedTo);
                setAssignedUserDetails(updatedUser || null);
                setSuccess('Query updated successfully');
                refreshData();
                setIsEditing(false);
            }
        } catch (err) {
            setError('Failed to update query');
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectUser = (user) => {
        setAssignedTo(user._id);
        setAssignedUserDetails(user);
        setIsDropdownOpen(false);
    };

    // Filter users based on the search term
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(term) ||
            user.branch.toLowerCase().includes(term) ||
            (user.usertype === "0" && "staff".includes(term)) ||
            (user.usertype === "1" && "branch Admin".includes(term)) ||
            (user.usertype === "2" && "staff".includes(term))
        );

        setFilteredUsers(filtered);
        setIsDropdownOpen(term.length > 0); // Open dropdown if there is text in the search
    };

    return (
        <div>
            <div className="p-2 border  mx-auto my-4 bg-white max-w-sm">
                {assignedUserDetails ? (
                    <div>
                        <p className="text-sm">
                            <span className="font-semibold">Assigned to:</span> {assignedUserDetails.name || 'No user assigned'}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Branch:</span> {assignedUserDetails.branch || 'N/A'}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Role:</span> {assignedUserDetails.usertype === "0" ? "Admin" : assignedUserDetails.usertype === "1" ? "Manager" : "Staff"}
                        </p>
                    </div>
                ) : (
                    <p className="text-lg font-medium text-gray-500">No user assigned</p>
                )}

                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-3  px-3 py-1 bg-[#6cb049] text-white rounded-md text-sm hover:bg-[#5aa43f] transition duration-200"
                >
                    Assign
                </button>
            </div>


            {/* Modal */}
            {isEditing && (
                <div className="fixed inset-0 border flex  items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold mb-4">Update Assigned User</h2>

                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search by name, branch, or user type"
                                className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />

                            <button
                                onClick={toggleDropdown}
                                className="block w-full p-2 border border-gray-300 bg-gray-100 rounded focus:outline-none hover:bg-gray-200 transition duration-200"
                            >
                                {assignedUserDetails ? assignedUserDetails.name : "Select a user"}
                            </button>

                            {/* Dropdown with search filtering */}
                            {isDropdownOpen && (
                               <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                               {filteredUsers.filter(user => user.usertype !== "2").length > 0 ? (
                                   filteredUsers
                                       .filter(user => user.usertype !== "2") // Filter out users with usertype "2"
                                       .map((user) => (
                                           <div
                                               key={user._id}
                                               onClick={() => selectUser(user)}
                                               className="p-4 cursor-pointer hover:bg-gray-100 transition duration-200"
                                           >
                                               <p className="font-semibold">{user.name}</p>
                                               <p className="text-sm text-gray-600">Branch: {user.branch}</p>
                                               <p className="text-sm text-gray-600">User Type: {user.usertype === "0" ? "Staff" : user.usertype === "1" ? "Branch Admin" : "Staff"}</p>
                                           </div>
                                       ))
                               ) : (
                                   <p className="p-4 text-sm text-gray-500">No users found</p>
                               )}
                           </div>
                           
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-4 py-2 bg-[#6cb049] text-white rounded disabled:bg-green-300 transition duration-200"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" />
                                        Updating...
                                    </span>
                                ) : (
                                    'Update'
                                )}
                            </button>

                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>

                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        {success && <p className="text-green-500 mt-4">{success}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
