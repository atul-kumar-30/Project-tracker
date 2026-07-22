import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

    useEffect(() => {
        axios.get('/projects/')
            .then((res) => {
                const projects = res.data;
                setStats({
                    total: projects.length,
                    active: projects.filter(p => p.status === 'Active').length,
                    completed: projects.filter(p => p.status === 'Completed').length
                });
            })
            .catch((err) => console.log(err));
    }, []);

    if (!user) return null;

    return (
        <div className="p-8 min-h-screen w-full bg-gray-900">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Profile Card */}
                <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="h-24 w-24 bg-indigo-600/30 border border-indigo-500 rounded-full flex items-center justify-center text-indigo-400 text-4xl font-bold shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
                                <span>{user.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-400">
                                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            </h1>
                            <p className="text-gray-400 text-lg flex items-center space-x-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex mt-3 items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-500/20 text-indigo-300 capitalize border border-indigo-500/30">
                            Role: {user.role}
                        </span>
                    </div>
                </div>

                {/* Stats Section */}
                <h2 className="text-xl font-semibold text-white pt-4">Your Statistics</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700">
                        <h3 className="text-gray-400 font-medium mb-2">Total Projects</h3>
                        <p className="text-4xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-indigo-500/30 border-t-indigo-500 border-t-4">
                        <h3 className="text-indigo-300 font-medium mb-2">Active Projects</h3>
                        <p className="text-4xl font-bold text-indigo-100">{stats.active}</p>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-green-500/30 border-t-green-500 border-t-4">
                        <h3 className="text-green-300 font-medium mb-2">Completed</h3>
                        <p className="text-4xl font-bold text-green-100">{stats.completed}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
