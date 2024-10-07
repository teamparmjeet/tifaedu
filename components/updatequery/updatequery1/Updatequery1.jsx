import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateQuery2({ query, audit }) {
  const queryid = query._id;
  const userid = query.userid;
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setMessage(''); // Reset message when the option changes
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare data to send to the backend
    const data = {
      queryId: queryid,
      actionby: userid,
      interestedsubStatus: selectedOption,
      message: selectedOption === 'response' ? message : '', // Only send message if response is selected
      stage: selectedOption === 'online' ? 2 : selectedOption === 'ofline' ? 3 : undefined,
    };

    // Handle status counts
    const statusCountsUpdate = {
      busy: audit?.statusCounts?.busy || 0,
      interested_but_not_proper_response: audit?.statusCounts?.interested_but_not_proper_response || 0,
    };

    // Update the count for 'interested_but_not_proper_response' if the selected option is 'response'
    if (selectedOption === 'response' && message === 'interested_but_not_proper_response') {
      statusCountsUpdate.interested_but_not_proper_response += 1;
    }

    // Check if any count reaches 3 for auto-close
    if (statusCountsUpdate.interested_but_not_proper_response >= 3) {
      data.autoClose = true;
    }

    // Add the updated status counts to the data object
    data.statusCounts = statusCountsUpdate;

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
          Interested Status:
        </label>
        <select
          id="statusSelect"
          value={selectedOption}
          onChange={handleOptionChange}
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
        >
          <option value="" disabled>-- Select Interested Status --</option>
          <option value="online">Online</option>
          <option value="ofline">Offline</option>
          <option value="response">Response</option>
        
        </select>
      </div>

      {/* Textarea for message, shown only when 'response' is selected */}
      {selectedOption === 'response' && (
        <div className="mb-6 transition-opacity duration-300 ease-in-out">
          <h4 className="text-lg font-semibold mb-3 text-[#29234b]">Message:</h4>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
            rows="4"
            name="message"
            placeholder="Please enter your message..."
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
