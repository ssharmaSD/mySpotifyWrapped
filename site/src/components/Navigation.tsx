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
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '16px 24px',
      borderBottom: '1px solid #dee2e6',
      marginBottom: '24px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            color: '#A23B72',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Suhani's Spotify Wrapped
        </Link>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#A23B72' : '#6c757d',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
