import React, { useState } from 'react';
import CrewLayout from './CrewLayout';
import CrewDashboardMobile from './CrewDashboardMobile';
import MobileTaskList from './MobileTaskList';
import MobileTaskExecution from './MobileTaskExecution';
import MobileCrewHistory from './MobileCrewHistory';
import MobileCrewEvaluation from './MobileCrewEvaluation';
import MobileTaskGuide from './MobileTaskGuide';
import MobileEvidenceListModal from './MobileEvidenceListModal';


interface CrewMobileAppProps {
    user: any;
    onLogout?: () => void;
}

export default function CrewMobileApp({ user, onLogout }: CrewMobileAppProps) {
    // Navigation State
    const [activePage, setActivePage] = useState<'dashboard' | 'history' | 'evaluation' | 'task-list' | 'guide'>('dashboard');
    const [selectedTask, setSelectedTask] = useState<any>(null); // For Execution Modal

    // Shared State
    const [selectedRole, setSelectedRole] = useState('cashier');

    // Handlers
    const handleNavigate = (page: 'dashboard' | 'history' | 'evaluation' | 'task-list' | 'guide') => {
        setActivePage(page);
    };

    const handleSelectTask = (task: any) => {
        setSelectedTask(task);
    };

    const handleUploadEvidence = async (formData: FormData) => {
        if (!selectedTask) return;

        try {
            // Call API
            const response = await fetch(`/api/tasks/${selectedTask.task_id}/evidence`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload evidence');
            }

            // Optional: Update local task state if needed, or rely on re-fetch
            // alert("Upload successful!"); 
        } catch (error) {
            console.error(error);
            alert("Error uploading evidence. Please try again.");
            throw error;
        }
    };

    // Render Content based on Route
    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <CrewDashboardMobile
                        user={user}
                        onNavigate={handleNavigate}
                        selectedRole={selectedRole}
                        onRoleChange={setSelectedRole}
                        onLogout={onLogout}
                    />
                );
            case 'task-list':
                return (
                    <MobileTaskList
                        user={user}
                        onBack={() => setActivePage('dashboard')}
                        onSelectTask={handleSelectTask}
                    />
                );
            case 'history':
                return (
                    <MobileCrewHistory
                        user={user}
                        onBack={() => setActivePage('dashboard')}
                        onSelectTask={handleSelectTask}
                    />
                );
            case 'evaluation':
                return <MobileCrewEvaluation onBack={() => setActivePage('dashboard')} />;
            case 'guide':
                return (
                    <MobileTaskGuide
                        onBack={() => setActivePage('dashboard')}
                        role={selectedRole}
                    />
                );
            default:
                return <div>Page Not Found</div>;
        }
    };

    return (
        <>
            {/* Main Page Content */}
            {renderContent()}

            {/* Task Execution Modal (Overlay) */}
            {selectedTask && (
                <MobileTaskExecution
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpload={handleUploadEvidence}
                />
            )}
        </>
    );
}
