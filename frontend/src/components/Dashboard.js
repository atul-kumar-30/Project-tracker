import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddProjectModal from './AddProjectModal';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProjectId, setEditProjectId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const CATEGORY_OPTIONS = [
        'All', 'Database',
        'Generative AI', 'AI/ML', 'Deep Learning', 'Computer Vision', 'NLP', 'LLM',
        'Frontend', 'Backend', 'Full Stack', 'MERN Stack',
        'Web Applications', 'Mobile App', 'Desktop App',
        'API', 'Game Development', 'Compiler', 'Cybersecurity', 'Cloud', 'DevOps', 
        'Blockchain', 'IoT', 'Automation', 'Data Science', 'Open Source'
    ];

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || (project.categories && project.categories.includes(selectedCategory));
        return matchesSearch && matchesCategory;
    });

    const openEditModal = (id) => {
        setEditProjectId(id);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditProjectId(null);
    };

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects", error);
            toast.error("Failed to fetch projects");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();

        // Listen for project creation events
        const handleProjectUpdate = () => {
            fetchProjects();
        };
        document.addEventListener('projectUpdate', handleProjectUpdate);
        return () => {
            document.removeEventListener('projectUpdate', handleProjectUpdate);
        };
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`/project/${id}`);
            toast.success("Project deleted successfully");
            fetchProjects();
        } catch (error) {
            toast.error("Failed to delete project");
        }
    };

    if (loading) return <div className="p-8 text-white">Loading projects...</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen w-full">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <span className="text-gray-400 font-medium">Total Projects: {filteredProjects.length}</span>
            </div>
            
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                </div>
                <div className="flex overflow-x-auto gap-2 pb-2 hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`
                        .hide-scroll::-webkit-scrollbar { display: none; }
                    `}</style>
                    {CATEGORY_OPTIONS.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-lg">No projects match your filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project._id} className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-white capitalize">{project.title}</h2>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                        project.status === 'Planning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        project.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                        {project.status || 'Planning'}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Start Date</span>
                                        <div className="flex items-center space-x-2 text-gray-300 text-sm font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">End Date</span>
                                        <div className="flex items-center space-x-2 text-gray-300 text-sm font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-12 6h.008v.008H9v-.008zm0-3h.008v.008H9V15zm0-3h.008v.008H9V12zm3 6h.008v.008H12v-.008zm0-3h.008v.008H12V15zm0-3h.008v.008H12V12zm3 6h.008v.008H15v-.008zm0-3h.008v.008H15V15zm0-3h.008v.008H15V12z" />
                                            </svg>
                                            <span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
                                        </div>
                                    </div>
                                </div>
                                {project.categories && project.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {project.categories.map((cat, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-700 text-gray-300">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {(project.githubLink || project.deployLink) && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600 text-gray-200 hover:text-white text-xs font-semibold border border-gray-600 hover:border-gray-500 transition-colors shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                                <span>GitHub</span>
                                            </a>
                                        )}
                                        {project.deployLink && (
                                            <a href={project.deployLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 text-xs font-semibold border border-indigo-500/20 hover:border-indigo-500/50 transition-colors shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                <span>Live Demo</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-auto">
                                <span className="text-xs text-gray-500 font-medium">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditModal(project._id)}
                                        className="text-gray-400 hover:text-indigo-400 bg-gray-900/50 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.89l10.68-10.68zM16.862 4.487L19.5 7.125" />
                                        </svg>
                                        <span>Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(project._id)}
                                        className="text-gray-500 hover:text-red-400 bg-gray-900/50 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {isEditModalOpen && (
                <AddProjectModal 
                    isModalOpen={isEditModalOpen} 
                    closeModal={closeEditModal} 
                    edit={true} 
                    id={editProjectId} 
                />
            )}
        </div>
    );
};

export default Dashboard;
