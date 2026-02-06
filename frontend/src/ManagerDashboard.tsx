import React, { useEffect, useState } from 'react';
import SupervisorList from './SupervisorList';
import SupervisorDetail from './SupervisorDetail';

export default function ManagerDashboard() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [selectedSupervisorId, setSelectedSupervisorId] = useState<number | null>(null);
    const [selectedLocationId, setSelectedLocationId] = useState<string>(""); // "" for All
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (locationId: string = "") => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            const url = locationId
                ? `http://localhost:8000/api/manager/supervisors?location_id=${locationId}`
                : `http://localhost:8000/api/manager/supervisors`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);

                // Select first supervisor by default if available
                if (data.supervisors && data.supervisors.length > 0) {
                    setSelectedSupervisorId(data.supervisors[0].id);
                } else {
                    setSelectedSupervisorId(null);
                }
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSupervisor = (id: number) => {
        setSelectedSupervisorId(id);
    };

    const handleFilterLocation = (locationId: string) => {
        setSelectedLocationId(locationId);
        fetchDashboardData(locationId);
    };

    if (loading) return <div className="h-full flex items-center justify-center text-gray-400">Loading Dashboard...</div>;
    if (!dashboardData) return <div className="h-full flex items-center justify-center text-gray-400">Failed to load data.</div>;

    const selectedSupervisor = dashboardData.supervisors.find((s: any) => s.id === selectedSupervisorId);

    return (
        <div className="flex h-full w-full bg-gray-50 border-t border-gray-200">

            {/* Left: Supervisor List */}
            <SupervisorList
                data={dashboardData}
                selectedId={selectedSupervisorId}
                onSelect={handleSelectSupervisor}
                selectedLocationId={selectedLocationId}
                onFilterLocation={handleFilterLocation}
            />

            {/* Right: Detailed View */}
            <div className="flex-1 overflow-hidden relative">
                {selectedSupervisor ? (
                    <SupervisorDetail supervisor={selectedSupervisor} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">Select a supervisor to view details</div>
                )}
            </div>
        </div>
    );
}
