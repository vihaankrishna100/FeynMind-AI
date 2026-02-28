import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-title">
            FeynMind AI
          </Link>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Learn
            </Link>
            <Link 
              to="/quiz" 
              className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
            >
              Quiz
            </Link>
            <Link 
              to="/chat" 
              className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
