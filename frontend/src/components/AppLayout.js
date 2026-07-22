import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => {
    return (
        <div className='bg-gray-900 min-h-screen text-gray-200'>
            <Navbar />
            <div className=' w-screen flex container mx-auto' style={{ height: 'calc(100vh - 56px)' }}>
                <div className="w-[220px] bg-gray-800/50 border-r border-gray-700">
                    <Sidebar />
                </div>
                <div className="flex-1 bg-gray-900 overflow-y-auto">
                    <div className="flex w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppLayout