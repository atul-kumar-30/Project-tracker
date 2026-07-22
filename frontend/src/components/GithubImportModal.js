import React, { Fragment, memo, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from "axios";
import toast from 'react-hot-toast';

const GithubImportModal = ({ isModalOpen, closeModal, onImport, initialUsername = '' }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState(initialUsername);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isModalOpen && initialUsername && repos.length === 0) {
            setUsername(initialUsername);
            handleFetchRepos(null, initialUsername);
        }
    }, [isModalOpen, initialUsername]);

    const handleFetchRepos = async (e, forceUsername = null) => {
        if (e) e.preventDefault();
        const searchUsername = forceUsername || username.trim();
        if (!searchUsername) return toast.error('Please enter a GitHub username');
        
        setLoading(true);
        try {
            const response = await fetch(`https://api.github.com/users/${searchUsername}/repos?per_page=100&sort=updated`);
            if (!response.ok) throw new Error('GitHub API Error');
            const data = await response.json();
            
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

    const extractDescriptionFromReadme = (text) => {
        const lines = text.split('\n');
        for (let line of lines) {
            line = line.trim();
            // Skip headings, empty lines, badges, image tags, html tags
            if (!line || line.startsWith('#') || line.startsWith('[!') || line.startsWith('<') || line.startsWith('![')) continue;
            // Clean markdown
            let clean = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_~`]/g, '');
            if (clean.length > 15) return clean.length > 250 ? clean.substring(0, 250) + '...' : clean;
        }
        return '';
    };

    const handleImportSingle = async (repo) => {
        const categories = repo.language ? [repo.language] : [];
        
        let description = repo.description || '';
        
        if (!description) {
            try {
                // We use toast.loading since it might take a second to fetch the README
                const toastId = toast.loading('Extracting description from README...');
                const res = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
                    headers: { 'Accept': 'application/vnd.github.v3.raw' }
                });
                if (res.ok) {
                    const text = await res.text();
                    description = extractDescriptionFromReadme(text);
                }
                toast.dismiss(toastId);
            } catch (e) {
                console.error(e);
            }
        }
        
        const payload = {
            title: repo.name.replace(/-/g, ' '),
            description: description,
            status: 'Completed',
            startDate: repo.created_at ? new Date(repo.created_at).toISOString().split('T')[0] : '',
            endDate: repo.updated_at ? new Date(repo.updated_at).toISOString().split('T')[0] : '',
            categories: categories,
            githubLink: repo.html_url,
            deployLink: repo.homepage || ''
        };

        onImport(payload);
    };

    const closeAndReset = () => {
        setStep(1);
        setUsername('');
        setRepos([]);
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
                                            <div className="mb-4">
                                                <h3 className="text-sm font-semibold text-white">Select a repository to import</h3>
                                                <p className="text-xs text-gray-400">Found {repos.length} public repositories for {username}</p>
                                            </div>
                                            
                                            <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                                {repos.map(repo => (
                                                    <div 
                                                        key={repo.id} 
                                                        className="p-4 rounded-lg border transition-all flex items-center justify-between bg-gray-700/30 border-gray-600 hover:border-gray-500 hover:bg-gray-700/50"
                                                    >
                                                        <div className="flex-1 pr-4">
                                                            <h4 className="text-sm font-bold text-white capitalize">{repo.name.replace(/-/g, ' ')}</h4>
                                                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{repo.description || 'No description provided.'}</p>
                                                            <div className="flex items-center space-x-3 mt-2">
                                                                {repo.language && (
                                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-600 text-gray-200">{repo.language}</span>
                                                                )}
                                                                <span className="text-[10px] text-gray-500">Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleImportSingle(repo)}
                                                            className="flex-shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                                                        >
                                                            Import
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className='flex justify-between items-center pt-4 border-t border-gray-700'>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setStep(1)} 
                                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none"
                                                >
                                                    &larr; Back
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
