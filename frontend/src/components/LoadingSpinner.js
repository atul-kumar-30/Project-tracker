import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = false }) => {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                {/* Inner spinning ring */}
                <div className="relative w-12 h-12 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
            </div>
            {message && (
                <p className="text-slate-300 font-medium tracking-wide animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="w-full py-12 flex items-center justify-center">
            {content}
        </div>
    );
};

export default LoadingSpinner;
