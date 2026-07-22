import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Timeline = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('http://localhost:9000/projects');
            // Sort by startDate
            const sorted = data.sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));
            setProjects(sorted);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects", error);
            toast.error("Failed to fetch projects");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) return <div className="p-8 text-white">Loading timeline...</div>;

    return (
        <div className="p-8 bg-gray-900 min-h-screen w-full">
            <h1 className="text-3xl font-bold text-white mb-8">Project Timeline</h1>
            
            {projects.length === 0 ? (
                <div className="text-gray-500">No projects to display on the timeline.</div>
            ) : (
                <div className="relative border-l border-gray-700 ml-4 space-y-8 pl-8 pt-4">
                    {projects.map((project, idx) => (
                        <div key={project._id} className="relative group">
                            <span className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-4 border-gray-900 transition-transform group-hover:scale-125 ${
                                project.status === 'Planning' ? 'bg-yellow-500' :
                                project.status === 'Active' ? 'bg-green-500' :
                                'bg-blue-500'
                            }`}></span>
                            
                            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all w-full max-w-3xl">
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                                
                                <div className="flex space-x-8 text-sm bg-gray-900/50 p-4 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 uppercase font-bold text-xs mb-1">Start Date</span>
                                        <span className="text-gray-300 font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 uppercase font-bold text-xs mb-1">End Date</span>
                                        <span className="text-gray-300 font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 uppercase font-bold text-xs mb-1">Status</span>
                                        <span className={`font-semibold ${
                                            project.status === 'Planning' ? 'text-yellow-500' :
                                            project.status === 'Active' ? 'text-green-400' :
                                            'text-blue-400'
                                        }`}>
                                            {project.status || 'Planning'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Timeline;
