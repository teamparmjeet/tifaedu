import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateQuery({ query, audit }) {
  const queryid = query._id;
  const userid = query.userid;
  const [selectedOption, setSelectedOption] = useState('');
  const [subOption, setSubOption] = useState('');
  const [message, setMessage] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSubOption('');
    setMessage('');
  };

  const handleSubOptionChange = (event) => {
    setSubOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare data to send to the backend
    const data = {
      queryId: queryid,
      actionby: userid,
      connectionStatus: selectedOption,
      message: message || subOption,
      // Set the appropriate sub status based on the selectedOption
      connectedsubStatus: selectedOption === 'connected' ? subOption : undefined,
      no_connectedsubStatus: selectedOption === 'no_connected' ? subOption : undefined,
      not_liftingsubStatus: selectedOption === 'not_lifting' ? subOption : undefined,
      wrongNo: selectedOption === 'wrong_no' ? true : false,
    };
    if (selectedOption === 'connected' && subOption === 'interested') {
      data.stage = 1; // Set stage to 1 when connected and interested
    }
    // Safely access and increment status counts
    const statusCountsUpdate = {
      busy: audit?.statusCounts?.busy || 0,
      call_back: audit?.statusCounts?.call_back || 0,
      switch_off: audit?.statusCounts?.switch_off || 0,
      network_error: audit?.statusCounts?.network_error || 0,
    };

    // Increment the count based on selectedOption and subOption
    if (selectedOption === 'not_lifting' && subOption === 'busy') {
      statusCountsUpdate.busy += 1; // Only increment the busy count
    } else if (selectedOption === 'not_lifting' && subOption === 'call_back') {
      statusCountsUpdate.call_back += 1; // Only increment the call_back count
    } else if (selectedOption === 'no_connected' && subOption === 'switch_off') {
      statusCountsUpdate.switch_off += 1; // Only increment the switch_off count
    } else if (selectedOption === 'no_connected' && subOption === 'network_error') {
      statusCountsUpdate.network_error += 1; // Only increment the network_error count
    }

    // Check if any count reaches 3, if so, set autoClose to true
    if (
      statusCountsUpdate.busy >= 3 ||
      statusCountsUpdate.call_back >= 3 ||
      statusCountsUpdate.switch_off >= 3 ||
      statusCountsUpdate.network_error >= 3
    ) {
      data.autoClose = true;
    }

    // Add the updated statusCounts to the data object
    data.statusCounts = {
      busy: statusCountsUpdate.busy,
      call_back: statusCountsUpdate.call_back,
      switch_off: statusCountsUpdate.switch_off,
      network_error: statusCountsUpdate.network_error,
    };

    try {
      const response = await axios.patch('/api/audit/update', data);

      if (response.status === 200) {
        console.log('Query updated successfully:', response.data);
        window.location.reload();
      } else {
        console.error('Error updating query:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto bg-white shadow-xl rounded-lg">
      <h3 className="text-xl font-semibold mb-2 text-indigo-700">Select a Status</h3>

      <div className="mb-6">
        <label htmlFor="statusSelect" className="block text-lg font-medium text-gray-700 mb-2">
          Main Status: 
        </label>
        <select
          id="statusSelect"
          value={selectedOption}
          onChange={handleOptionChange}
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="connected">Connected</option>
          <option value="no_connected">No Connected</option>
          <option value="not_lifting">Not Lifting</option>
          <option value="wrong_no">Wrong Number</option>
        </select>
      </div>

      {/* Sub-options for 'Connected' */}
      {selectedOption === 'connected' && (
        <div className="mb-6 transition-opacity duration-300 ease-in-out">
          <h4 className="text-lg font-semibold mb-3 text-[#29234b]">Connected Options:</h4>
          <select
            value={subOption}
            onChange={handleSubOptionChange}
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
          >
            <option value="" disabled>-- Select Sub Option --</option>
            <option value="interested">Interested</option>
            <option value="not_interested">Not Interested</option>
          </select>
        </div>
      )}

      {/* Sub-options for 'Not Lifting' */}
      {selectedOption === 'not_lifting' && (
        <div className="mb-6 transition-opacity duration-300 ease-in-out">
          <h4 className="text-lg font-semibold mb-3 text-[#29234b]">Not Lifting Options:</h4>
          <select
            value={subOption}
            onChange={handleSubOptionChange}
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
          >
            <option value="" disabled>-- Select Sub Option --</option>
            <option value="busy">Busy</option>
            <option value="call_back">Call Back</option>
          </select>
        </div>
      )}

      {/* Sub-options for 'No Connected' */}
      {selectedOption === 'no_connected' && (
        <div className="mb-6 transition-opacity duration-300 ease-in-out">
          <h4 className="text-lg font-semibold mb-3 text-[#29234b]">No Connected Options:</h4>
          <select
            value={subOption}
            onChange={handleSubOptionChange}
            className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
          >
            <option value="" disabled>-- Select Sub Option --</option>
            <option value="switch_off">Switch Off</option>
            <option value="network_error">Network Error</option>
          </select>
        </div>
      )}

      {/* Textarea for 'Wrong No' */}
      {selectedOption === 'wrong_no' && (
        <div className="mb-6 transition-opacity duration-300 ease-in-out">
          <h4 className="text-lg font-semibold mb-3 text-[#29234b]">Wrong Number Feedback:</h4>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
            rows="4"
            name="message"
            placeholder="Please describe the issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        className="mt-6 w-full py-3 bg-[#29234b] text-white font-semibold rounded-md hover:bg-[#29234b] transition-colors duration-200"
      >
        Submit
      </button>
    </form>
  );
}
