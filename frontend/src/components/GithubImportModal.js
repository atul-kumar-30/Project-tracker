import React, { Fragment, memo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from "axios";
import toast from 'react-hot-toast';

const GithubImportModal = ({ isModalOpen, closeModal }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [repos, setRepos] = useState([]);
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFetchRepos = async (e) => {
        e.preventDefault();
        if (!username.trim()) return toast.error('Please enter a GitHub username');
        
        setLoading(true);
        try {
            const { data } = await axios.get(`https://api.github.com/users/${username.trim()}/repos?per_page=100&sort=updated`);
            const filteredRepos = data.filter(repo => !repo.fork);
            setRepos(filteredRepos);
            if (filteredRepos.length === 0) {
                toast.error('No public repositories found for this user');
            } else {
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch repositories. Check username.');
        } finally {
            setLoading(false);
        }
    };

    const toggleRepoSelection = (repo) => {
        const isSelected = selectedRepos.find(r => r.id === repo.id);
        if (isSelected) {
            setSelectedRepos(selectedRepos.filter(r => r.id !== repo.id));
        } else {
            setSelectedRepos([...selectedRepos, repo]);
        }
    };

    const handleImport = async () => {
        if (selectedRepos.length === 0) return toast.error('Please select at least one repository');
        
        setLoading(true);
        let successCount = 0;
        
        for (const repo of selectedRepos) {
            const categories = repo.language ? [repo.language] : [];
            
            const payload = {
                title: repo.name.replace(/-/g, ' '),
                description: repo.description || 'Imported from GitHub',
                status: 'Completed',
                startDate: repo.created_at ? new Date(repo.created_at).toISOString().split('T')[0] : null,
                endDate: repo.updated_at ? new Date(repo.updated_at).toISOString().split('T')[0] : null,
                categories: categories,
                githubLink: repo.html_url,
                deployLink: repo.homepage || ''
            };

            try {
                const res = await axios.post('/project/', payload);
                const customEvent = new CustomEvent('projectUpdate', { detail: { ...res.data } });
                document.dispatchEvent(customEvent);
                successCount++;
            } catch (error) {
                console.error(`Failed to import ${repo.name}`, error);
            }
        }
        
        setLoading(false);
        if (successCount === selectedRepos.length) {
            toast.success(`Successfully imported ${successCount} projects!`);
        } else {
            toast.success(`Imported ${successCount} projects, some failed to import (maybe duplicates).`);
        }
        
        closeAndReset();
    };

    const closeAndReset = () => {
        setStep(1);
        setUsername('');
        setRepos([]);
        setSelectedRepos([]);
        closeModal();
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as='div' open={isModalOpen} onClose={closeAndReset} className="relative z-50">
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
                    <div className="fixed inset-0 flex items-center justify-center p-4 w-screen h-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="rounded-xl bg-gray-800 w-11/12 md:w-8/12 lg:w-6/12 border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                                <Dialog.Title as='div' className={'bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-10 flex justify-between items-center'}>
                                    <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                        <span>Import from GitHub</span>
                                    </h1>
                                    <button onClick={closeAndReset} className='text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1.5 focus:outline-none transition-colors'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dialog.Title>
                                
                                <div className='px-8 py-6 bg-gray-800 overflow-y-auto'>
                                    {step === 1 ? (
                                        <form onSubmit={handleFetchRepos}>
                                            <div className='mb-6'>
                                                <label htmlFor="username" className='block text-sm font-medium text-gray-300 mb-1.5'>GitHub Username</label>
                                                <input 
                                                    id="username"
                                                    value={username} 
                                                    onChange={(e) => setUsername(e.target.value)} 
                                                    type="text" 
                                                    className='border border-gray-600 bg-gray-700 text-white rounded-lg w-full text-sm py-3 px-4 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder-gray-400' 
                                                    placeholder='e.g., atul-kumar-30' 
                                                />
                                                <p className="mt-2 text-xs text-gray-500">We will fetch all public repositories associated with this account.</p>
                                            </div>
                                            <div className='flex justify-end'>
                                                <button 
                                                    type="submit" 
                                                    disabled={loading}
                                                    className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-500/30 flex items-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {loading ? <span>Searching...</span> : <span>Search Repositories</span>}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div>
                                            <div className="mb-4 flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-white">Select repositories to import</h3>
                                                    <p className="text-xs text-gray-400">Found {repos.length} public repositories for {username}</p>
                                                </div>
                                                <button 
                                                    onClick={() => setSelectedRepos(repos.length === selectedRepos.length ? [] : [...repos])}
                                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    {repos.length === selectedRepos.length ? 'Deselect All' : 'Select All'}
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                                {repos.map(repo => {
                                                    const isSelected = selectedRepos.find(r => r.id === repo.id);
                                                    return (
                                                        <div 
                                                            key={repo.id} 
                                                            onClick={() => toggleRepoSelection(repo)}
                                                            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-start space-x-4 ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-gray-700/30 border-gray-600 hover:border-gray-500'}`}
                                                        >
                                                            <div className="mt-1">
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-500 bg-gray-800'}`}>
                                                                    {isSelected && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                                                                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="text-sm font-bold text-white capitalize">{repo.name.replace(/-/g, ' ')}</h4>
                                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{repo.description || 'No description provided.'}</p>
                                                                <div className="flex items-center space-x-3 mt-2">
                                                                    {repo.language && (
                                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-700 text-gray-300">{repo.language}</span>
                                                                    )}
                                                                    <span className="text-[10px] text-gray-500">Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            
                                            <div className='flex justify-between items-center pt-4 border-t border-gray-700'>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setStep(1)} 
                                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none"
                                                >
                                                    &larr; Back
                                                </button>
                                                <button 
                                                    onClick={handleImport}
                                                    disabled={loading || selectedRepos.length === 0}
                                                    className={`px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-500/30 flex items-center space-x-2 ${(loading || selectedRepos.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {loading ? <span>Importing...</span> : <span>Import {selectedRepos.length} Projects</span>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default memo(GithubImportModal)
