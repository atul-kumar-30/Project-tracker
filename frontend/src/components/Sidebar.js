import React, { useCallback, useState, useEffect } from 'react'
import AddProjectModal from './AddProjectModal'
import GithubImportModal from './GithubImportModal'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const [isModalOpen, setModalState] = useState(false)
  const [prefillData, setPrefillData] = useState(null)

  const openModal = useCallback(() => {
    setModalState(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalState(false)
    setPrefillData(null)
  }, [])

  useEffect(() => {
    const handleOpenCreateModal = (e) => {
      setPrefillData(e.detail)
      setModalState(true)
    }
    document.addEventListener('openCreateProjectModal', handleOpenCreateModal)
    return () => {
      document.removeEventListener('openCreateProjectModal', handleOpenCreateModal)
    }
  }, [])





  return (
    <div className='py-5 flex flex-col h-screen border-r border-gray-800 bg-gray-900'>
      <div className="px-6 mb-8 flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z" clipRule="evenodd" />
              </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">Portfolio<span className="text-indigo-400">Tracker</span></span>
      </div>

      <div className="px-4 mb-4 flex flex-col space-y-2">
        <Link to="/dashboard" className={`flex items-center space-x-3 font-medium text-sm p-2.5 rounded-lg transition-all ${pathname.includes('/dashboard') ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/80'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span>Dashboard</span>
        </Link>
        <Link to="/timeline" className={`flex items-center space-x-3 font-medium text-sm p-2.5 rounded-lg transition-all ${pathname.includes('/timeline') ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/80'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Timeline</span>
        </Link>
        <Link to="/profile" className={`flex items-center space-x-3 font-medium text-sm p-2.5 rounded-lg transition-all ${pathname.includes('/profile') ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/80'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>My Profile</span>
        </Link>
      </div>
      <div className="px-4 mb-6 space-y-3">
        <button onClick={openModal} className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          <span>Create Project</span>
        </button>
      </div>

      <div className="mt-auto px-4 pb-2">
          <button
              onClick={logout}
              className="w-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>Log out</span>
          </button>
      </div>

      <AddProjectModal isModalOpen={isModalOpen} closeModal={closeModal} prefillData={prefillData} />
    </div>
  )
}

export default Sidebar