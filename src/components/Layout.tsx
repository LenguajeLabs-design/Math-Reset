import type { ReactNode } from 'react'
import type { Screen } from '../types'
import { ArrowLeft, CheckIcon } from './Icons'
import { Logo } from './Logo'

interface LayoutProps {
  children: ReactNode
  screen: Screen
  onNavigate: (screen: Screen) => void
  showBack?: boolean
  onBack?: () => void
}

export function Layout({ children, screen, onNavigate, showBack, onBack }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="side-rail">
        <Logo />
        <div className="rail-rule" />
        <nav aria-label="Main navigation">
          <button className={`nav-item ${screen === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
            <span className="nav-dot" /> Home
          </button>
          <button className={`nav-item ${screen === 'progress' ? 'active' : ''}`} onClick={() => onNavigate('progress')}>
            <span className="nav-progress-icon"><CheckIcon /></span> Progress
          </button>
        </nav>
        <div className="rail-bottom">
          <div className="rail-note"><span>01</span><p>Make the number friendlier.</p></div>
        </div>
      </aside>

      <main className="main-column">
        <header className="top-bar">
          <div className="mobile-brand"><Logo /></div>
          {showBack ? <button className="back-button" onClick={onBack}><ArrowLeft /> <span>Back</span></button> : <span className="eyebrow">A gentler way into math</span>}
          <div className="top-bar-right"><span className="session-status"><i /> No pressure</span></div>
        </header>
        <div className="page-content">{children}</div>
        <footer className="app-footer"><span>Math Reset</span><span>See the math. Build the confidence.</span></footer>
      </main>
    </div>
  )
}
