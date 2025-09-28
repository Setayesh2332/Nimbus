import './Navbar.css'

export function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <a className="navbar__brand" href="/" aria-label="Nimbus home">
          Nimbus
        </a>
        <nav aria-label="Primary" className="navbar__nav">
          <a className="navbar__link" href="#about">
            About
          </a>
          <a
            className="navbar__feedback"
            href="mailto:hello@nimbus.app?subject=Feedback%20for%20Nimbus"
          >
            Share your feedback
          </a>
        </nav>
      </div>
    </header>
  )
}