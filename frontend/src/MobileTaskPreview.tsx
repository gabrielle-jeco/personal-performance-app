import React, { useEffect, useState } from 'react';
import { X, Trash2, Calendar, User } from 'lucide-react';

interface MobileTaskPreviewProps {
    task: any;
    isOpen: boolean;
    onClose: () => void;
    onDeleteProof: (taskId: number) => void;
    showHistoryLabel?: boolean;
}

export default function MobileTaskPreview({ task, isOpen, onClose, onDeleteProof, showHistoryLabel = false }: MobileTaskPreviewProps) {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    if (!isOpen || !task) return null;

    const handleClose = () => {
        setAnimateIn(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${animateIn ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0 pointer-events-none'}`}>
            {/* Modal Content */}
            <div
                className={`bg-white w-full max-w-sm rounded-[30px] overflow-hidden shadow-2xl relative transition-all duration-300 ease-out transform ${animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'
                    }`}
            >
                {/* Header Image Area */}
                <div className="relative w-full aspect-[3/4] bg-gray-900 group">
                    {task.proof_image ? (
                        <img
                            src={task.proof_image}
                            alt="Proof"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                <span className="text-2xl">📷</span>
                            </div>
                            <p className="text-sm font-medium">No Image Uploaded</p>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

                    {/* Navbar inside Image */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                        <button
                            onClick={handleClose}
                            className="bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition"
                        >
                            <X size={20} />
                        </button>

                        {showHistoryLabel && (
                            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                                HISTORY
                            </span>
                        )}
                    </div>

                    {/* Bottom Info inside Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h2 className="text-xl font-bold leading-tight mb-1">{task.title}</h2>
                        <div className="flex items-center gap-3 text-white/80 text-xs">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(task.updated_at || new Date()).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={12} />
                                Uploaded by Crew
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-5 bg-white flex items-center justify-between gap-4">
                    {task.proof_image ? (
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Actions</p>
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this proof?')) {
                                        onDeleteProof(task.task_id);
                                        handleClose();
                                    }
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 font-bold py-3 px-4 rounded-xl transition"
                            >
                                <Trash2 size={18} />
                                Delete Proof
                            </button>
                        </div>
                    ) : (
                        <p className="text-center w-full text-gray-400 text-sm py-2">
                            Task pending or no visual proof required.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
