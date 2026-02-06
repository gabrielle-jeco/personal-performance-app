import React, { type ReactNode, useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

interface MobileLayoutProps {
    children: ReactNode;
    title?: string;
    onBack?: () => void;
    allowScroll?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title = "Dashboard", onBack, allowScroll = true }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                // Shrink threshold at 20px
                setIsScrolled(scrollContainerRef.current.scrollTop > 20);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        // Root App Shell: Fixed, No Window Scroll, Dual-Color Background
        <div className="fixed inset-0 font-sans text-gray-800 overflow-hidden bg-[linear-gradient(to_bottom,#2563EB_30%,#F9FAFB_30%)]">

            {/* Header: Dynamic Sticky (Z-30) */}
            <header
                className={`absolute top-0 left-0 right-0 bg-blue-600 text-white flex flex-col justify-end z-30 transition-all duration-300 ease-in-out ${isScrolled ? 'h-16 px-6 pb-4 shadow-md' : 'h-28 px-6 pb-6 shadow-none'
                    }`}
            >
                <div className="relative flex items-center justify-center w-full">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="absolute left-0 p-1 -ml-2 hover:bg-white/10 rounded-full transition"
                        >
                            <ChevronLeft size={28} />
                        </button>
                    )}
                    <h1 className={`font-bold transition-all duration-300 text-center ${isScrolled ? 'text-lg' : 'text-xl'
                        }`}>
                        {title}
                    </h1>
                </div>
            </header>

            {/* Internal Scroll View: Z-10 Under Header */}
            <div
                ref={scrollContainerRef}
                className={`absolute inset-0 z-10 overflow-x-hidden ${allowScroll ? 'overflow-y-auto overscroll-none' : 'overflow-y-hidden'}`}
            >
                {/* Spacer - Remains constant to push content down initially */}
                <div className="h-28 w-full shrink-0"></div>

                {/* Main Content */}
                {/* if !allowScroll: Fill remaining height exactly and flex-col for children to manage scroll */}
                <main className={`bg-gray-50 rounded-t-[30px] w-full px-6 py-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] ${allowScroll
                    ? 'min-h-screen'
                    : 'h-[calc(100vh-7rem)] flex flex-col'
                    }`}>
                    {children}

                    {/* Bottom Padding only needed for scrollable main */}
                    {allowScroll && <div className="h-20"></div>}
                </main>
            </div>
        </div>
    );
};

export default MobileLayout;
