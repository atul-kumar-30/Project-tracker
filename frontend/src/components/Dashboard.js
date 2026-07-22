import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddProjectModal from './AddProjectModal';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editProjectId, setEditProjectId] = useState(null);

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
            const { data } = await axios.get('http://localhost:9000/projects');
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
            await axios.delete(`http://localhost:9000/project/${id}`);
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
                <span className="text-gray-400 font-medium">Total Projects: {projects.length}</span>
            </div>
            
            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-lg">No projects found. Click "Add Project" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
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
                                {project.links && project.links.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.links.map((link, i) => (
                                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-gray-700/50 hover:bg-indigo-500/20 text-gray-300 hover:text-indigo-300 text-xs font-medium border border-gray-600 hover:border-indigo-500/50 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                </svg>
                                                <span>{link.name}</span>
                                            </a>
                                        ))}
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
