import React from 'react';
import { LogOut, ChevronDown, CheckSquare, FileText, BarChart2, Users } from 'lucide-react';
import MobileLayout from './MobileLayout';

// Mock Data
const SUPERVISOR_NAME = "Raymond Rochville!";
const LOCATION_NAME = "YOGYA CIAMIS (CMS)";
const PROGRESS_PERCENTAGE = 65;

interface DashboardProps {
    onNavigate: (view: any) => void;
}

const SupervisorDashboardMobile: React.FC<DashboardProps> = ({ onNavigate }) => {
    // onNavigate is a prop we'll use to switch 'pages' in this mobile view (Dashboard -> CrewList)

    const handleLogout = () => {
        // Direct logout without confirmation on mobile as requested
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.reload();
    };

    return (
        <MobileLayout title="Dashboard" allowScroll={false}>
            {/* 1. Welcome Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm mb-4 relative overflow-hidden flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400">Welcome, Supervisor Fashion</p>
                    <h2 className="text-lg font-bold text-gray-800">{SUPERVISOR_NAME}</h2>
                </div>
                <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                    <LogOut size={20} />
                </button>
            </div>

            {/* 2. Location Dropdown (Mock) */}
            <div className="bg-gray-200 rounded-xl p-3 mb-4 flex justify-between items-center px-4">
                <span className="font-bold text-gray-700 text-sm">{LOCATION_NAME}</span>
                <ChevronDown size={16} className="text-blue-600" />
            </div>

            {/* 3. Average Task Progress */}
            <div className="mb-8 mt-2">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                        className="bg-gray-400 h-3 rounded-full"
                        style={{ width: `${PROGRESS_PERCENTAGE}%` }}
                    ></div>
                </div>
                <p className="text-center text-xs text-gray-500 font-medium">
                    Average Task Progress : {PROGRESS_PERCENTAGE}%
                </p>
            </div>

            {/* 5. Menu Grid */}
            <div className="grid grid-cols-2 gap-4">
                <MenuCard
                    icon={<CheckSquare size={32} className="text-blue-600" />}
                    label="Checklist"
                    onClick={() => onNavigate('CHECKLIST')}
                />
                <MenuCard
                    icon={<FileText size={32} className="text-blue-600" />}
                    label="Follow Up"
                    onClick={() => console.log('Follow Up clicked')}
                />
                <MenuCard
                    icon={<BarChart2 size={32} className="text-blue-600" />}
                    label="Report"
                    onClick={() => onNavigate('REPORT')}
                />
                <MenuCard
                    icon={<Users size={32} className="text-blue-600" />}
                    label="Employee"
                    onClick={() => onNavigate('EMPLOYEE_LIST')}
                />
            </div>
        </MobileLayout>
    );
};

const MenuCard = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="bg-gray-100 hover:bg-white hover:shadow-md transition-all rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square border border-transparent hover:border-gray-100"
    >
        <div className="p-0">{icon}</div>
        <span className="text-blue-600 font-bold text-sm tracking-wide">{label}</span>
    </button>
);

export default SupervisorDashboardMobile;
