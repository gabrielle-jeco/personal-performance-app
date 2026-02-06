import React from 'react';
import { Trash2, X } from 'lucide-react';

interface SubmissionHistoryProps {
    task: any;
    onClose: () => void;
}

export default function SubmissionHistory({ task, onClose }: SubmissionHistoryProps) {
    if (!task) return null;

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">Submission History</h2>
                    <p className="text-sm text-gray-400">{task.title}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                {/* Before Section */}
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> Before
                    </h3>

                    <div className="space-y-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative flex items-center justify-center text-gray-400 text-[10px]">
                                IMG
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">IMG_12345678.jpeg</p>
                                <p className="text-[10px] text-gray-400">11 Nov 2025, 8.00 AM</p>
                            </div>
                            <button className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative flex items-center justify-center text-gray-400 text-[10px]">
                                IMG
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">IMG_12345679.jpeg</p>
                                <p className="text-[10px] text-gray-400">11 Nov 2025, 8.00 AM</p>
                            </div>
                            <button className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* After Section */}
                <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary"></span> After
                    </h3>

                    <div className="space-y-3">
                        {task.proof_image ? (
                            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    <img src={`http://localhost:8000/storage/${task.proof_image}`} alt="Proof" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">Proof_Submission.jpg</p>
                                    <p className="text-[10px] text-gray-400">{new Date(task.updated_at).toLocaleString()}</p>
                                </div>
                                <button className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400 italic">No submission yet.</div>
                        )}

                        {/* Mock Static Entry */}
                        <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition opacity-60">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative flex items-center justify-center text-gray-400 text-[10px]">
                                IMG
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-700 truncate">IMG_12345678.jpeg</p>
                                <p className="text-[10px] text-gray-400">11 Nov 2025, 8.00 AM</p>
                            </div>
                            <button className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
