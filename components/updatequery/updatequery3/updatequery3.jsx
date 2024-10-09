import React, { useState } from 'react';
import axios from 'axios';

export default function UpdateQuery3({ query, audit }) {
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

    // Prepare data to send to the backend for the audit update
    const data = {
      queryId: queryid,
      actionby: userid,
      onlinesubStatus: selectedOption,
      message: selectedOption === 'response' ? message : '', // Only send message if response is selected
      stage: selectedOption === 'admission' ? 4 : selectedOption === 'ready_visit' ? 5 : undefined, // Update stage based on selection
    };

    // Handle status counts
    const statusCountsUpdate = {
      interested_but_not_proper_response: audit?.statusCounts?.interested_but_not_proper_response || 0,
    };

    // Update the count for 'interested_but_not_proper_response' if selected
    if (selectedOption === 'interested_but_not_proper_response') {
      statusCountsUpdate.interested_but_not_proper_response += 1;
    }

    // Add the updated status counts to the data object
    data.statusCounts = statusCountsUpdate;

    try {
      // API call for audit update
      const auditResponse = await axios.patch('/api/audit/update', data);
      if (auditResponse.status === 200) {
        console.log('Audit updated successfully:', auditResponse.data);
        window.location.reload();
      } else {
        console.error('Error updating audit:', auditResponse.statusText);
      }

      // Handle 'admission' and 'ready_visit' options separately
      if (selectedOption === 'admission' || selectedOption === 'ready_visit') {
        const queryUpdateData = {
          id: queryid,
          addmission: selectedOption === 'admission' ? true : undefined, // Set admission only for 'admission'
        };

        const queryResponse = await axios.patch('/api/queries/update', queryUpdateData);
        if (queryResponse.status === 200) {
          console.log('Query updated successfully:', queryResponse.data);
        } else {
          console.error('Error updating query:', queryResponse.statusText);
        }
      } 
      // Auto-close query if status count threshold is reached
      else if (statusCountsUpdate.interested_but_not_proper_response >= 3) {
        const queryUpdateData = {
          id: queryid,
          autoclosed: 'close'
        };

        const queryResponse = await axios.patch('/api/queries/update', queryUpdateData);
        if (queryResponse.status === 200) {
          console.log('Query autoclosed successfully:', queryResponse.data);
        } else {
          console.error('Error autoclosed query:', queryResponse.statusText);
        }
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
           Status:
        </label>
        <select
          id="statusSelect"
          value={selectedOption}
          onChange={handleOptionChange}
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#29234b] focus:border-[#29234b]"
        >
          <option value="" disabled>-- Select Status --</option>
          <option value="admission">Enroll</option>
          <option value="interested_but_not_proper_response">Not Proper Response</option>
          <option value="response">Response</option>
          <option value="ready_visit">Ready for Visit</option>
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
