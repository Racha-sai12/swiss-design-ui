import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(undefined)
const THEME_STORAGE_KEY = "swiss-design-ui-theme"
const LEGACY_THEME_STORAGE_KEY = "react-design-patterns-theme"

function getInitialPreference() {
  const savedTheme =
    window.localStorage.getItem(THEME_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY)

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  return null
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(getInitialPreference)
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  )
  const theme = preference ?? systemTheme

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event) => setSystemTheme(event.matches ? "dark" : "light")

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "dark" ? "#0c0a09" : "#fafaf9",
    )
  }, [theme])

  useEffect(() => {
    if (preference !== null) {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    }
  }, [preference])

  const toggleTheme = () => {
    setPreference(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
