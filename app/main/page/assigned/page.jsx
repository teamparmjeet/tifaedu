import React from 'react';

export default function Page() {
  return (
    <div className="flex h-screen p-6 bg-gray-100">
      {/* Left Section: Assigned Queries */}
      <div className="w-2/3 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Assigned Queries</h2>
        <ul className="space-y-2">
          {/* Example Queries */}
          <li className="p-3 bg-gray-50 rounded-md hover:bg-blue-50 shadow-md">
            Query 1
          </li>
          <li className="p-3 bg-gray-50 rounded-md hover:bg-blue-50 shadow-md">
            Query 2
          </li>
          <li className="p-3 bg-gray-50 rounded-md hover:bg-blue-50 shadow-md">
            Query 3
          </li>
          {/* Add more queries here */}
        </ul>




        Under Process . . .
      </div>

      {/* Right Section: Accepted and Pending Queries */}
      <div className="w-1/3 ml-6 flex flex-col space-y-6">
        {/* Top Section: Accepted Queries */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Accepted Queries</h2>
          <ul className="space-y-2">
            {/* Example Accepted Queries */}
            <li className="p-3 bg-green-50 rounded-md hover:bg-green-100 shadow-md">
              Accepted Query 1
            </li>
            <li className="p-3 bg-green-50 rounded-md hover:bg-green-100 shadow-md">
              Accepted Query 2
            </li>
            {/* Add more accepted queries here */}
          </ul>
        </div>

        {/* Bottom Section: Pending Queries */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Pending Queries</h2>
          <ul className="space-y-2">
            {/* Example Pending Queries */}
            <li className="p-3 bg-yellow-50 rounded-md hover:bg-yellow-100 shadow-md">
              Pending Query 1
            </li>
            <li className="p-3 bg-yellow-50 rounded-md hover:bg-yellow-100 shadow-md">
              Pending Query 2
            </li>
            {/* Add more pending queries here */}
          </ul>
        </div>
      </div>
    </div>
  );
}
