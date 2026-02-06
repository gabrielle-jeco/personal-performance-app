import React from 'react';
import { Trash2, X } from 'lucide-react';

interface TaskPreviewProps {
    task: any;
    onClose: () => void;
    onDeleteProof: (taskId: number) => void;
}

export default function TaskPreview({ task, onClose, onDeleteProof }: TaskPreviewProps) {
    if (!task) return null;

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">Task Proof</h2>
                    <p className="text-sm text-gray-400">{task.title}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Main Preview (Gray Box) */}
            <div className="flex-1 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                {task.proof_image ? (
                    <img src={task.proof_image} alt="Proof" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-400 text-sm">No Image Preview</div>
                )}
            </div>

            {/* Thumbnails List (Real Data) */}
            <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                {task.proof_image ? (
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 hover:shadow-md transition cursor-pointer">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={task.proof_image} alt="Thumb" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-700 truncate">Submission Image</p>
                            <p className="text-[10px] text-gray-400">
                                {new Date(task.updated_at || new Date()).toLocaleString()}
                            </p>
                        </div>

                        <button
                            onClick={() => onDeleteProof(task.task_id)}
                            className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full transition"
                            title="Delete this image"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-xs text-gray-400 py-4">
                        No submission images found.
                    </div>
                )}
            </div>
        </div>
    );
}
