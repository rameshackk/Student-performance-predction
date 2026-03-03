import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaMagic, FaLayerGroup } from 'react-icons/fa';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FaChartBar },
    { path: '/students', name: 'Students', icon: FaUsers },
    { path: '/predict', name: 'Predict', icon: FaMagic },
    { path: '/groups', name: 'Groups', icon: FaLayerGroup },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Student Performance</h2>
        <p>Prediction System</p>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => {
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
    </nav>
  );
};

export default Navigation;
