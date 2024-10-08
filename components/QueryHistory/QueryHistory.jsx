import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { ArrowRight } from "lucide-react";

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
        <div className="p-6 mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold mb-6 text-[#29234b]  tracking-wide">
          Query History
        </h2>
        {audit && audit.history.length > 0 ? (
          <div className="space-y-6">
            {audit.history
              .slice()
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-[#29234b]">
                      {getUserNameById(entry.actionBy)} {entry.action} Query
                    </h3>
                    <p className="text-gray-500 text-sm italic">
                      {new Date(entry.actionDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-base text-gray-700">
                    <p className="mb-2 flex gap-2 items-center">
                      <span className="font-semibold text-[#6cb049]">Current Stage:</span>
                      <span>
                        {entry.stage === "0"
                          ? "Initial Stage"
                          : entry.stage === "1"
                          ? "Interested"
                          : entry.stage === "2"
                          ? "Online Addmission Process"
                          : entry.stage === "3"
                          ? "Ofline Addmission"
                          : entry.stage === "4"
                          ? "Online Addmission"
                          : "Unknown Stage"}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm mt-4">
                    {Object.keys(entry.changes)
                      .filter(
                        (field) =>
                          field !== "statusCounts" &&  field !== "actionby" &&
                          (entry.changes[field].oldValue || entry.changes[field].newValue)
                      )
                      .map((field, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 p-3 rounded-md mb-2 border border-gray-200"
                        >
                          <strong className="text-gray-800 capitalize">{field}</strong>
                          <div className="ml-4 flex gap-6 items-center mt-2">
                            <span className="block text-red-500">
                              {typeof entry.changes[field].oldValue === "object"
                                ? JSON.stringify(entry.changes[field].oldValue)
                                : entry.changes[field].oldValue}
                            </span>
                            <ArrowRight size={16} className="text-gray-400" />
                            <span className="block text-green-500">
                              {typeof entry.changes[field].newValue === "object"
                                ? JSON.stringify(entry.changes[field].newValue)
                                : entry.changes[field].newValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    {Object.keys(entry.changes)
                      .filter((field) => field !== "statusCounts")
                      .every((field) => !entry.changes[field].oldValue && !entry.changes[field].newValue) && (
                        <p className="text-gray-500">No changes</p>
                      )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No history available for this query.</p>
        )}
      </div>
      
    );
}
