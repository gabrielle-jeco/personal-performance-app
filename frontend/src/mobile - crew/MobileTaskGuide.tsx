import React, { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import CrewLayout from './CrewLayout';

interface MobileTaskGuideProps {
    onBack: () => void;
    role: string;
}

export default function MobileTaskGuide({ onBack, role }: MobileTaskGuideProps) {
    const [isRead, setIsRead] = useState(false);

    // Guide Content Mapping
    const guideContent: any = {
        'cashier': {
            title: 'Crew - Cashier Guide',
            steps: [
                { title: 'Preparation', desc: 'Ensure uniform is clean. Check POS machine functionality.' },
                { title: 'Customer Service', desc: 'Greet customers: "Selamat Pagi/Siang/Sore". Offer additional products.' },
                { title: 'Transaction', desc: 'Double-check items and total. Provide receipt to customer.' },
                { title: 'Closing', desc: 'Count cash accurately. Clean station before leaving.' }
            ]
        },
        'supermarket': {
            title: 'Crew - Supermarket Guide',
            steps: [
                { title: 'Display', desc: 'Ensure shelves are fully stocked and facing is tidy.' },
                { title: 'Expiry Check', desc: 'Check for expired products daily. Rotate stock (FEFO).' },
                { title: 'Cleanliness', desc: 'Keep aisles clean and free of obstacles.' },
                { title: 'Assistance', desc: 'Help customers find products they need.' }
            ]
        },
        // Default fallbacks for other roles
        'fresh': {
            title: 'Crew - Fresh Guide',
            steps: [
                { title: 'Hygiene', desc: 'Wear gloves and hairnet at all times.' },
                { title: 'Quality Control', desc: 'Remove bruised or spoiled items immediately.' },
                { title: 'Refill', desc: 'Keep fresh produce fully stocked and misted if necessary.' }
            ]
        },
        'fashion': {
            title: 'Crew - Fashion Guide',
            steps: [
                { title: 'Display', desc: 'Fold clothes neatly and arrange by size/color.' },
                { title: 'Fitting Room', desc: 'Monitor fitting room usage and return items to floor.' },
                { title: 'Customer Style', desc: 'Assist customers with sizing and style recommendations.' }
            ]
        }
    };

    const content = guideContent[role] || guideContent['cashier'];

    return (
        <CrewLayout
            title="Task Guide"
            showBack={true}
            onBack={onBack}
        >
            <div className="flex flex-col h-full pb-6">

                {/* 1. Guide Content Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <BookOpen size={24} />
                        <h2 className="font-bold text-lg">{content.title}</h2>
                    </div>

                    <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                        {content.steps.map((step: any, index: number) => (
                            <p key={index}>
                                <strong>{index + 1}. {step.title}:</strong><br />
                                {step.desc}
                            </p>
                        ))}
                    </div>
                </div>

                {/* 2. Standardized Checkbox Card */}
                <label className="flex items-center gap-3 bg-white p-4 rounded-xl cursor-pointer border border-blue-100 transition hover:bg-blue-50 mb-6 shadow-sm">
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${isRead ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {isRead && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <input
                        type="checkbox"
                        checked={isRead}
                        onChange={(e) => setIsRead(e.target.checked)}
                        className="hidden"
                    />
                    <span className="text-sm font-semibold text-gray-700">I have read and understood</span>
                </label>

                {/* Spacer to push button down if content is short */}
                <div className="flex-1"></div>

                {/* 3. Primary Action Button */}
                <button
                    onClick={onBack}
                    disabled={!isRead}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform disabled:opacity-50 disabled:shadow-none"
                >
                    Confirm & Start Work
                </button>
            </div>
        </CrewLayout>
    );
}
