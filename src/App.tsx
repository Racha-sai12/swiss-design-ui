import { useEffect, useState } from "react"
import { componentPages } from "./docs/componentCatalog"
import DocumentationPages from "./docs/DocumentationPages"
import { useTheme } from "./contexts/ThemeContext"
import "./styles/App.css"
import Test from "./docs/pages/test"

function App() {
  const { theme, toggleTheme } = useTheme()
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.slice(1)
    return hash === "overview" || componentPages.some((page) => page.id === hash)
      ? hash
      : "overview"
  })

  useEffect(() => {
    const syncPage = () => {
      const hash = window.location.hash.slice(1)
      setActivePage(
        hash === "overview" || componentPages.some((page) => page.id === hash)
          ? hash
          : "overview",
      )
    }
    window.addEventListener("hashchange", syncPage)
    return () => window.removeEventListener("hashchange", syncPage)
  }, [])

  const activePageLabel =
    componentPages.find((page) => page.id === activePage)?.label ?? "Overview"
  useEffect(() => {
    document.title = `${activePageLabel} — Swiss Design UI`
  }, [activePageLabel])

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar" aria-label="Component documentation">
        <a className="wordmark" href="#overview" aria-label="Swiss Design UI home">
          S<span>/</span>UI
        </a>
        <p className="docs-sidebar__eyebrow">Library / Components</p>
        <nav className="docs-sidebar__nav" aria-label="Component pages">
          <a
            href="#overview"
            className="docs-sidebar__link docs-sidebar__link--overview"
            aria-current={activePage === "overview" ? "page" : undefined}
          >
            Overview
          </a>
          <p className="docs-sidebar__group-label">Components</p>
          {componentPages.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="docs-sidebar__link"
              aria-current={activePage === id ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="docs-sidebar__footer">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </aside>

      <main className="docs-main">
        <header className="page-header">
          <span className="page-header__context">Swiss Design UI</span>
          <span className="page-header__current" aria-live="polite">{activePageLabel}</span>
        </header>

        <section
          className="intro"
          id="overview"
          aria-labelledby="page-title"
          hidden={activePage !== "overview"}
        >
          <p className="eyebrow"><span>01</span> / Library</p>
          <h1 id="page-title">Components</h1>
          <p className="intro-copy">
            A practical reference for reusable interface elements.
            Each component is documented with its options and an example.
          </p>
        </section>

        <DocumentationPages activePage={activePage} />

        <footer className="page-footer">
          <span>Swiss Design UI</span>
          <span>Structure creates clarity.</span>
        </footer>
      </main>
    </div>
  )
}

export default App
