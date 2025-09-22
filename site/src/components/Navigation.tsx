import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Introduction', icon: '🏠' },
  { path: '/overview', label: 'Overview', icon: '🧭' },
  { path: '/bts', label: 'BTS Deep Dive', icon: '🎧' },
  { path: '/extended', label: 'Extended History', icon: '📈' },
  { path: '/clusters', label: 'Temporal Clusters', icon: '⏱️' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Suhani's Spotify Wrapped
        </Link>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
