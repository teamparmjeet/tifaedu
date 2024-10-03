import React from 'react'

export default function QueryHistory({ item }) {
    return (
        <>
            {item.changes && Object.keys(item.changes).length > 0 && (
                <div className="mt-3 overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
                    <table className="min-w-full text-xs bg-gray-50 rounded-lg">
                        {/* <thead>
                                                    <tr className="bg-gray-200 text-gray-700">
                                                        <th className="px-4 py-2 text-left rounded-tl-lg rounded-tr-lg">Field</th>
                                                        <th className="px-4 py-2 text-left">Old Value</th>
                                                        <th className="px-4 py-2 text-left rounded-tl-lg rounded-tr-lg">New Value</th>
                                                    </tr>
                                                </thead> */}
                        <tbody>
                            {Object.entries(item.changes).map(([key, { oldValue, newValue }]) => (
                                newValue && (
                                    <tr key={key} className="border-b hover:bg-gray-100 transition-colors">
                                        <td className="px-4 py-2 text-gray-600 font-medium">
                                            {key}
                                        </td>
                                        <td className="px-4 py-2 text-red-600">{oldValue}</td>
                                        <td className="px-4 py-2 text-[#6cb049] font-semibold">→ {newValue}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
