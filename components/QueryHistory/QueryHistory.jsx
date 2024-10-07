import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader/Loader';

export default function QueryHistory({ initialData }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [audit, setAudit] = useState(null);
    const [error, setError] = useState(null);
    const id = initialData._id;

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/admin/fetchall/admin');
                setUsers(response.data.fetch);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Fetch audit data
    useEffect(() => {
        const fetchAuditData = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/audit/findsingle/${id}`);
                setAudit(response.data);
            } catch (error) {
                console.error("Error fetching audit data:", error);
                setError("Failed to fetch audit data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAuditData();
    }, [id]);

    const getUserNameById = (userId) => {
        const user = users.find(user => user._id === userId);
        return user ? user.name : userId; // Return the user's name or the ID if not found
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className=" p-2 mx-auto bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Query History</h2>
            {audit && audit.history.length > 0 ? (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium">Action</th>
                                <th className="px-6 py-4 text-left text-sm font-medium">Stage</th>
                                <th className="px-6 py-4 text-left text-sm font-medium">Action By</th>
                                <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {audit.history.map((entry, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.changes.message.newValue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getUserNameById(entry.actionBy)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(entry.actionDate).toLocaleString()}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-4">No history available for this query.</p>
            )}
        </div>
    );
}
