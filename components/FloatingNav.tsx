
import React, { useState } from 'react';

type View = 'jobs' | 'vector_stores' | 'orchestration' | 'containers';

interface FloatingNavProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const OrbIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L8 6V10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10V6L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const FloatingNav: React.FC<FloatingNavProps> = ({ activeView, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (view: View) => {
        onNavigate(view);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div 
                    className="card-base p-2 mb-4 rounded-lg flex flex-col items-center space-y-2"
                    style={{ animation: 'fade-in 0.3s ease' }}
                >
                    <button 
                        onClick={() => handleNavigation('orchestration')}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeView === 'orchestration' ? 'text-neon-blue font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        Orchestration
                    </button>
                    <button 
                        onClick={() => handleNavigation('containers')}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeView === 'containers' ? 'text-neon-blue font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        Containers
                    </button>
                    <button 
                        onClick={() => handleNavigation('jobs')}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeView === 'jobs' ? 'text-neon-blue font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        Fine-Tuning Jobs
                    </button>
                    <button 
                        onClick={() => handleNavigation('vector_stores')}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors ${activeView === 'vector_stores' ? 'text-neon-blue font-bold' : 'text-gray-300 hover:bg-white/10'}`}
                    >
                        Vector Stores
                    </button>
                </div>
            )}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Toggle Quick Navigation"
                className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white transition-transform hover:scale-110"
                style={{
                    animation: 'glow-orb 4s ease-in-out infinite'
                }}
            >
                <OrbIcon />
            </button>
        </div>
    );
};

export default FloatingNav;
