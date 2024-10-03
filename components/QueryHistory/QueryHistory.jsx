"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function QueryHistory({ item }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getUserNameById = (id) => {
        const user = users.find(user => user._id === id);
        return user ? user.name : id; 
    };

    return (
        <>
            {item.changes && Object.keys(item.changes).length > 0 && (
                <div className="mt-3 overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                    <table className="min-w-full text-xs bg-gray-50 rounded-lg">
                        <tbody>
                            {Object.entries(item.changes).map(([key, { oldValue, newValue }]) => (
                                newValue && (
                                    <tr key={key} className="border-b hover:bg-gray-100 transition-colors">
                                        <td className="px-4 py-2 text-gray-600 font-medium">
                                            {key}
                                        </td>
                                        <td className="px-4 py-2 text-red-600">
                                            {key === 'user' ? oldValue : getUserNameById(oldValue) }
                                        </td>
                                        <td className="px-4 py-2 text-[#6cb049] font-semibold">
                                            → {key === 'user' ? newValue : getUserNameById(newValue) }
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
