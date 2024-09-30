import React from 'react'

export default function User({ params }) {
    const { id } = params;
    return (
        <>
            {id}
        </>
    )
}
