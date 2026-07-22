import React, { Fragment, memo, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from "axios"
import toast from 'react-hot-toast'

const AddProjectModal = ({ isModalOpen, closeModal, edit = false, id = null }) => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('Planning');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [links, setLinks] = useState([{ name: '', url: '' }]);
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');

    useEffect(() => {
        if (edit && isModalOpen) {
            axios.get(`/project/${id}`)
                .then((res) => {
                    const data = res.data[0];
                    setTitle(data.title)
                    setDesc(data.description)
                    setStatus(data.status || 'Planning')
                    setStartDate(data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '')
                    setEndDate(data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '')
                    setLinks(data.links && data.links.length > 0 ? data.links : [{ name: '', url: '' }])
                    setGithubLink(data.githubLink || '')
                    setDeployLink(data.deployLink || '')
                })
                .catch((error) => {
                    toast.error('Something went wrong')
                })
        }
    }, [isModalOpen, edit, id]);


    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Filter out empty links
        const validLinks = links.filter(l => l.name.trim() !== '' && l.url.trim() !== '');

        const payload = {
            title, 
            description: desc, 
            status, 
            startDate: startDate || null, 
            endDate: endDate || null, 
            links: validLinks,
            githubLink: githubLink || '',
            deployLink: deployLink || ''
        };

        if (!edit) {
            axios.post('/project/', payload)
                .then((res) => {
                    closeModal()
                    const customEvent = new CustomEvent('projectUpdate', { detail: { ...res.data } });
                    document.dispatchEvent(customEvent);
                    toast.success('Project created successfully')
                    setTitle('')
                    setDesc('')
                    setStatus('Planning')
                    setStartDate('')
                    setEndDate('')
                    setLinks([{ name: '', url: '' }])
                    setGithubLink('')
                    setDeployLink('')
                })
                .catch((error) => {
                    if (error.response?.status === 422) {
                        toast.error(error.response.data.details[0].message)
                    } else {
                        toast.error('Something went wrong')
                    }
                })
        } else {
            axios.put(`/project/${id}`, payload)
                .then((res) => {
                    closeModal()
                    const customEvent = new CustomEvent('projectUpdate', { detail: { ...res.data } });
                    document.dispatchEvent(customEvent);
                    toast.success('Project updated successfully')
                    setTitle('')
                    setDesc('')
                })
                .catch((error) => {
                    if (error.response?.status === 422) {
                        toast.error(error.response.data.details[0].message)
                    } else {
                        toast.error('Something went wrong')
                    }
                })
        }

    }

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as='div' open={isModalOpen} onClose={() => closeModal()} className="relative z-50">
                <div className="fixed inset-0 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen ">
                        {/* <div className="fixed inset-0 "> */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300 "
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="rounded-xl bg-gray-800 w-6/12 border border-gray-700 shadow-2xl overflow-hidden">
                                <Dialog.Title as='div' className={'bg-gray-800/90 border-b border-gray-700 px-6 py-4 sticky top-0 flex justify-between items-center'}>
                                    <h1 className="text-xl font-semibold text-white">{edit ? 'Edit Project' : 'Create Project'}</h1>
                                    <button onClick={() => closeModal()} className='text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1.5 focus:outline-none transition-colors'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} className='gap-4 px-8 py-6 bg-gray-800'>
                                    <div className='mb-4'>
                                        <label htmlFor="title" className='block text-sm font-medium text-gray-300 mb-1.5'>Title</label>
                                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' placeholder='Project title' />
                                    </div>
                                    <div className='mb-6'>
                                        <label htmlFor="Description" className='block text-sm font-medium text-gray-300 mb-1.5'>Description</label>
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' rows="5" placeholder='Project description'></textarea>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mb-6'>
                                        <div>
                                            <label htmlFor="status" className='block text-sm font-medium text-gray-300 mb-1.5'>Status</label>
                                            <select value={status} onChange={(e) => setStatus(e.target.value)} className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all'>
                                                <option value="Planning">Planning</option>
                                                <option value="Active">Active</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="startDate" className='block text-sm font-medium text-gray-300 mb-1.5'>Start Date</label>
                                            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all' />
                                        </div>
                                        <div>
                                            <label htmlFor="endDate" className='block text-sm font-medium text-gray-300 mb-1.5'>End Date</label>
                                            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all' />
                                        </div>
                                    </div>
                                    
                                    <div className='grid grid-cols-2 gap-4 mb-6'>
                                        <div>
                                            <label htmlFor="githubLink" className='block text-sm font-medium text-gray-300 mb-1.5 flex items-center space-x-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                                <span>GitHub Repository</span>
                                            </label>
                                            <input value={githubLink} onChange={(e) => setGithubLink(e.target.value)} type="url" placeholder="https://github.com/..." className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' />
                                        </div>
                                        <div>
                                            <label htmlFor="deployLink" className='block text-sm font-medium text-gray-300 mb-1.5 flex items-center space-x-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                <span>Live Deployment URL</span>
                                            </label>
                                            <input value={deployLink} onChange={(e) => setDeployLink(e.target.value)} type="url" placeholder="https://..." className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2.5 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' />
                                        </div>
                                    </div>

                                    <div className='mb-6'>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className='block text-sm font-medium text-gray-300'>Additional Links</label>
                                            <button 
                                                type="button" 
                                                onClick={() => setLinks([...links, { name: '', url: '' }])}
                                                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center"
                                            >
                                                + Add Link
                                            </button>
                                        </div>
                                        {links.map((link, index) => (
                                            <div key={index} className="flex space-x-2 mb-2">
                                                <input 
                                                    value={link.name} 
                                                    onChange={(e) => {
                                                        const newLinks = [...links];
                                                        newLinks[index].name = e.target.value;
                                                        setLinks(newLinks);
                                                    }} 
                                                    type="text" 
                                                    placeholder="Link Name (e.g. Figma)" 
                                                    className='border border-gray-600 bg-gray-700 text-white rounded-lg w-1/3 text-sm py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' 
                                                />
                                                <input 
                                                    value={link.url} 
                                                    onChange={(e) => {
                                                        const newLinks = [...links];
                                                        newLinks[index].url = e.target.value;
                                                        setLinks(newLinks);
                                                    }} 
                                                    type="url" 
                                                    placeholder="URL (https://...)" 
                                                    className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const newLinks = links.filter((_, i) => i !== index);
                                                        setLinks(newLinks);
                                                    }}
                                                    className="text-gray-500 hover:text-red-400 p-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex justify-end items-center space-x-3 pt-2 border-t border-gray-700'>
                                        <button type="button" onClick={() => closeModal()} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500">Cancel</button>
                                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30">Save</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>

                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default memo(AddProjectModal)