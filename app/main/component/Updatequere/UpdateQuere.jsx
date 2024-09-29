import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateQuere({ isOpen, onClose, initialData = {},refreshData }) {
  const [callStage, setCallStage] = useState(initialData.callStage || 'new');
  const [connectionStatus, setConnectionStatus] = useState(initialData.connectionStatus || 'not-connected1');
  const [leadStatus, setLeadStatus] = useState(initialData.leadStatus || 'interested');
  const [actionBy, setActionBy] = useState(initialData.actionBy || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callStageOptions = ['new', 'RNR1', 'RNR2', 'RNR3', 'busy', 'call-back', 'auto-closed'];
  const connectionStatusOptions = ['not-connected1', 'not-connected2', 'not-connected3', 'connected', 'transferred'];
  const leadStatusOptions = ['wrong-lead', 'not-interested', 'interested', 'NPR1', 'NPR2', 'ready-to-join', 'enrolled', 'branch-visited', 'not-visited'];

  const getFilteredOptions = (options, selected) => {
    const index = options.indexOf(selected);
    if (index === -1) return options;
    const filteredOptions = [selected];
    if (index + 1 < options.length) {
      filteredOptions.push(options[index + 1]);
    }
    return filteredOptions;
  };

  const filteredCallStageOptions = getFilteredOptions(callStageOptions, callStage);
  const filteredConnectionStatusOptions = getFilteredOptions(connectionStatusOptions, connectionStatus);
  const filteredLeadStatusOptions = getFilteredOptions(leadStatusOptions, leadStatus);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToUpdate = {
      id: initialData._id,
      callStage,
      connectionStatus,
      leadStatus,
      actionBy:"Tifa Main Branch",
    };

    console.log('Data to update:', dataToUpdate); // Log the data being sent

    try {
      const response = await axios.patch('/api/queries/update', dataToUpdate);
      console.log('Response from server:', response.data);
      if (response.data.success) {
        refreshData();
        onClose(); // Close the modal only if the update was successful
      } else {
        setError(response.data.message || 'Failed to update query.');
      }
    } catch (err) {
      console.error('Error while updating:', err);
      setError('An error occurred while updating the information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Update Information</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="callStage">Call Stage:</label>
            <select
              id="callStage"
              value={callStage}
              onChange={(e) => setCallStage(e.target.value)}
              className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 rounded-md appearance-none placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
              >
              {filteredCallStageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="connectionStatus">Connection Status:</label>
            <select
              id="connectionStatus"
              value={connectionStatus}
              onChange={(e) => setConnectionStatus(e.target.value)}
              className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 rounded-md appearance-none placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
              >
              {filteredConnectionStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="leadStatus">Lead Status:</label>
            <select
              id="leadStatus"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value)}
               className="block w-full px-2 py-2 text-gray-500 bg-white border border-gray-200 rounded-md appearance-none placeholder:text-gray-400 focus:border-[#6cb049] focus:outline-none focus:ring-[#6cb049] sm:text-sm"
            >
              {filteredLeadStatusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="actionBy">Action By:</label>
            <input
              type="text"
              id="actionBy"
              value={actionBy}
              onChange={(e) => setActionBy(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div> */}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
