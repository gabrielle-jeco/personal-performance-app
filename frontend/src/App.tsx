import { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import ManagerLayout from './ManagerLayout';
import ManagerDashboard from './ManagerDashboard';
import SupervisorLayout from './SupervisorLayout';
import SupervisorDashboard from './SupervisorDashboard';
import SupervisorMobileApp from './SupervisorMobileApp';
import SupervisorPerformance from './SupervisorPerformance';

function App() {
  const [user, setUser] = useState<any>(null);
  const [activeSupervisorPage, setActiveSupervisorPage] = useState<'employees' | 'performance'>('employees');

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simplified Auth Flow for Phase 2 Verification
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setActiveSupervisorPage('employees'); // Reset
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ALLOW SM and RM
  if (user.role_type === 'manager') {
    return (
      <ManagerLayout user={user} onLogout={handleLogout}>
        <ManagerDashboard />
      </ManagerLayout>
    );
  }

  // Supervisor Flow
  if (user.role_type === 'supervisor') {
    // Simple mobile check (you can move this to a hook later if needed)
    const isMobile = window.innerWidth < 768;

    // Re-check on resize (optional for dev convenience)
    // useEffect(() => { ... }) - omitted for brevity, initial check is usually enough for "Load as Mobile"

    if (isMobile) {
      return <SupervisorMobileApp />;
    }

    return (
      <SupervisorLayout
        activePage={activeSupervisorPage}
        onPageChange={setActiveSupervisorPage}
        onLogout={handleLogout}
      >
        {activeSupervisorPage === 'employees' ? (
          <SupervisorDashboard />
        ) : (
          <SupervisorPerformance />
        )}
      </SupervisorLayout>
    );
  }

  return <div>Role not supported yet.</div>;
}

export default App;
