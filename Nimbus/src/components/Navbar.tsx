import './Navbar.css'

export type PageName = 'weather' | 'about' | 'feedback'

interface NavbarProps {
  currentPage: PageName
}

export function Navbar({ currentPage }: NavbarProps) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <a className="navbar__brand" href="#weather" aria-label="Nimbus home">
          Nimbus
        </a>
        <nav aria-label="Primary" className="navbar__nav">
          <a
            className="navbar__link"
            href="#weather"
            aria-current={currentPage === 'weather' ? 'page' : undefined}
          >
            Weather
          </a>
          <a
            className="navbar__link"
            href="#about"
            aria-current={currentPage === 'about' ? 'page' : undefined}
          >
            About
          </a>
          <a
            className="navbar__feedback"
            href="#feedback"
            aria-current={currentPage === 'feedback' ? 'page' : undefined}
          >
            Feedback
          </a>
        </nav>
      </div>
    </header>
  )
}