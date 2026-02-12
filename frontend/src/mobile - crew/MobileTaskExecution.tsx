import React, { useState, useEffect } from 'react';
import { Camera, X, Trash2, CheckCircle, Image as ImageIcon, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import MobileEvidenceListModal from './MobileEvidenceListModal';
import MobileCrewTaskPreview from './MobileCrewTaskPreview';

interface MobileTaskExecutionProps {
    task: any;
    onClose: () => void;
    onUpload: (formData: FormData) => Promise<void>;
}

export default function MobileTaskExecution({ task, onClose, onUpload }: MobileTaskExecutionProps) {
    // Calculated State (Moved up for init)
    const isPastDue = new Date(task.due_at) < new Date(new Date().setHours(0, 0, 0, 0));
    const isReadOnly = task.status === 'approved' || task.status === 'submitted' || task.status === 'completed' || isPastDue;

    const [animateIn, setAnimateIn] = useState(false);

    // View States
    const [showHistory, setShowHistory] = useState(false); // Acts as "Preview Mode"
    const [showEvidenceList, setShowEvidenceList] = useState(isReadOnly); // Acts as "List Mode" (Init with ReadOnly)

    // Upload State (Preview only, real data comes from task or fresh upload)
    const [beforePreview, setBeforePreview] = useState<string | null>(task.before_image ? (task.before_image.startsWith('http') ? task.before_image : `http://localhost:8000/storage/${task.before_image}`) : null);
    const [afterPreview, setAfterPreview] = useState<string | null>(task.after_image ? (task.after_image.startsWith('http') ? task.after_image : `http://localhost:8000/storage/${task.after_image}`) : null);

    // Loading State
    const [isUploading, setIsUploading] = useState(false);

    // Preview State
    const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    const handleClose = () => {
        if (showEvidenceList) {
            if (isReadOnly) {
                onClose(); // Close app/modal directly if read-only
            } else {
                // Level 2: Close List -> Return to Upload View
                setShowEvidenceList(false);
            }
        } else {
            // Level 3: Close Entire Modal -> Return to Dashboard
            onClose();
        }
    };

    const handleHistoryClick = () => {
        // Open List View
        setShowEvidenceList(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        if (isReadOnly) return; // Prevent upload in read-only mode

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);

            if (type === 'before') setBeforePreview(previewUrl);
            else setAfterPreview(previewUrl);

            // Immediate Upload
            const formData = new FormData();
            formData.append(type, file);

            setIsUploading(true);
            try {
                await onUpload(formData);
            } catch (error) {
                console.error(error);
                alert("Upload failed");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteEvidence = async (type: 'before' | 'after') => {
        if (isReadOnly) return; // Prevent delete in read-only mode

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`/api/tasks/${task.task_id}/evidence?type=${type}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                if (type === 'before') setBeforePreview(null);
                else setAfterPreview(null);
            } else {
                alert("Failed to delete image");
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed");
        }
    };

    // STACKED RENDER
    return (
        <>
            {/* 1. Underlying Upload View: Only show if NOT Read Only */}
            {/* 1. Underlying Upload View: Only Render if NOT Read Only (Prevent Ghosting) */}
            {!isReadOnly && (
                <div key="upload-view" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}></div>

                    {/* Modal Content */}
                    <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl z-10 animate-fade-in-up">

                        {/* Upload Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
                            {/* Before Button */}
                            <div className="relative group">
                                <label className={`aspect-square bg-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform ${isUploading ? 'opacity-50 pointer-events-none' : ''} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                                    {beforePreview ? (
                                        <img src={beforePreview} alt="Before" className="w-full h-full object-cover rounded-3xl" />
                                    ) : (
                                        <>
                                            <Camera size={32} className="text-gray-600" />
                                            <span className="font-bold text-gray-600 text-sm">Before</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'before')} disabled={isReadOnly} />
                                </label>
                            </div>

                            {/* After Button */}
                            <div className="relative group">
                                <label className={`aspect-square bg-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform ${isUploading ? 'opacity-50 pointer-events-none' : ''} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}>
                                    {afterPreview ? (
                                        <img src={afterPreview} alt="After" className="w-full h-full object-cover rounded-3xl" />
                                    ) : (
                                        <>
                                            <ImageIcon size={32} className="text-gray-600" />
                                            <span className="font-bold text-gray-600 text-sm">After</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'after')} disabled={isReadOnly} />
                                </label>
                            </div>
                        </div>

                        {/* Footer Actions (History & Done) */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleHistoryClick}
                                className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-full shadow-lg active:scale-95 transition-transform text-sm"
                            >
                                History
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-full shadow-lg active:scale-95 transition-transform text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 2. Evidence List Overlay (Portaled on top) */}
            <MobileEvidenceListModal
                isOpen={showEvidenceList}
                onClose={handleClose}
                task={{
                    ...task,
                    before_image: beforePreview?.replace('http://localhost:8000/storage/', '') || 'https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=1000&auto=format&fit=crop',
                    after_image: afterPreview?.replace('http://localhost:8000/storage/', '') || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop'
                }}
                onSelectImage={(type) => {
                    if (type === 'proof') return;
                    setActiveTab(type as 'before' | 'after');
                    setShowHistory(true);
                }}
                onDelete={(type) => {
                    if (type === 'before' || type === 'after') handleDeleteEvidence(type);
                }}
                readOnly={isReadOnly}
            />

            {/* 3. Preview Overlay */}
            <MobileCrewTaskPreview
                task={task}
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                beforeImage={beforePreview}
                afterImage={afterPreview}
                onDelete={handleDeleteEvidence}
                readOnly={isReadOnly}
            />
        </>
    );
}
