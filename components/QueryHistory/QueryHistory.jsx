import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '@/components/Loader/Loader';
import { ArrowRight, Clock, FileText, UserCheck } from 'lucide-react';

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
        console.error('Error fetching audit data:', error);
        setError('Failed to fetch audit data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [id]);

  // Get user name by ID
  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : userId; // Return the user's name or the ID if not found
  };

  // Map stages to more readable names
  const getStageName = (stage) => {
    const stages = {
      '0': 'Initial Stage',
      '1': 'Interested',
      '2': 'Online Admission Process',
      '3': 'Offline Admission',
      '4': 'Student Enrolled',
      '5': 'Visit',
      '6': 'Ofline Admission Last Step',
    };
    return stages[stage] || 'Unknown Stage';
  };
  const formatFieldValue = (value) => {
    if (typeof value !== 'string') return value; // If it's not a string, return as is
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="text-3xl font-extrabold mb-6 text-[#29234b] tracking-wide flex items-center gap-4">
        <FileText className="text-[#6cb049] animate-bounce" size={32} />
        <span className="bg-gradient-to-r from-[#29234b] to-[#6cb049] text-transparent bg-clip-text">
          Query History
        </span>
      </h2>

      {audit && audit.history.length > 0 ? (
        <div className="space-y-8">
          {audit.history
            .slice()
            .reverse()
            .map((entry, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 shadow-md rounded-2xl p-6 border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <UserCheck size={28} className="text-[#6cb049]" />
                    {getUserNameById(entry.actionBy)} {entry.action} Query
                  </h3>
                  <p className="text-gray-500 text-sm italic flex items-center gap-2">
                    <Clock size={18} />
                    {new Date(entry.actionDate).toLocaleString()}
                  </p>
                </div>

                <div className="text-base text-gray-700 mb-6">
                  <p className="flex gap-3 items-center">
                    <span className="font-semibold text-[#6cb049]">Current Stage:</span>
                    <span>{getStageName(entry.stage)}</span>
                  </p>
                </div>

                <div className="text-sm mt-4 space-y-4">
                  {Object.keys(entry.changes)
                    .filter(
                      (field) =>
                        field !== 'statusCounts' &&
                        field !== 'actionby' &&
                        (entry.changes[field].oldValue || entry.changes[field].newValue)
                    )
                    .map((field, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-md border border-gray-200 flex items-center gap-6 shadow-sm "
                      >
                        <strong className="text-gray-800 capitalize">{field}</strong>
                        <div className="flex items-center gap-2">
                          <span className="block text-red-500">
                            {typeof entry.changes[field].oldValue === 'object'
                              ? JSON.stringify(entry.changes[field].oldValue)
                              : formatFieldValue(entry.changes[field].oldValue)}
                          </span>
                          <ArrowRight size={18} className="text-gray-400" />
                          <span className="block text-green-500">
                            {typeof entry.changes[field].newValue === 'object'
                              ? JSON.stringify(entry.changes[field].newValue)
                              : formatFieldValue(entry.changes[field].newValue)}
                          </span>
                        </div>

                      </div>
                    ))}
                  {Object.keys(entry.changes)
                    .filter((field) => field !== 'statusCounts')
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
