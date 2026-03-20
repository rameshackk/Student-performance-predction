import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaUsers, FaUserPlus, FaMagic, FaLayerGroup, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  // All hooks MUST be called before any conditional returns
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  // Now it's safe to check auth and return early
  if (!auth) {
    return <div>Loading auth...</div>;
  }

  const { userRole, logout, currentUser } = auth;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FaChartBar, roles: ['admin', 'student'] },
    { path: '/students', name: 'Students', icon: FaUsers, roles: ['admin', 'student'] },
    { path: '/add-student', name: 'Add Student', icon: FaUserPlus, roles: ['admin'] },
    { path: '/predict', name: 'Predict', icon: FaMagic, roles: ['admin', 'student'] },
    { path: '/groups', name: 'Groups', icon: FaLayerGroup, roles: ['admin', 'student'] },
    { path: '/mcq-tests', name: 'MCQ Tests', icon: FaClipboardList, roles: ['admin', 'student'] },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Student Performance</h2>
        <p>Prediction System</p>
        {currentUser && <p className="user-email">{currentUser.email} ({userRole})</p>}
      </div>
      <ul className="nav-menu">
        {navItems
          .filter(item => item.roles.includes(userRole))
          .map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;