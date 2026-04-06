import React from 'react'

export default function HomeLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-background-light text-white p-4 max-w-md mx-auto'>
            { children }
        </div>
    )
}
