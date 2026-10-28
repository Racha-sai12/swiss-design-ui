import type { CSSProperties, ReactNode } from 'react'
import type { AppBarColor } from '../styles/types.js'

export type AppBarProps = {
  bottom?: boolean
  fixed?: boolean
  contextual?: boolean
  wrapContent?: boolean
  color?: AppBarColor
  elevation?: number
  dense?: boolean
  gutters?: boolean
  children: ReactNode
  actions?: ReactNode
  contextualActions?: ReactNode
}

export default function AppBar({
  bottom = false,
  fixed = false,
  contextual = false,
  wrapContent = false,
  color = 'Default',
  elevation = 0,
  dense = false,
  gutters = true,
  children,
  actions,
  contextualActions,
}: AppBarProps) {
  const safeElevation = Number.isFinite(elevation)
    ? Math.max(0, Math.min(24, Math.trunc(elevation)))
    : 0
  const visibleActions = contextual && contextualActions != null
    ? contextualActions
    : actions
  const classNames = [
    'custom-app-bar',
    `custom-app-bar--${color.toLowerCase()}`,
    bottom && 'custom-app-bar--bottom',
    fixed && 'custom-app-bar--fixed',
    wrapContent && 'custom-app-bar--wrap',
    dense && 'custom-app-bar--dense',
    gutters && 'custom-app-bar--gutters',
  ]
    .filter(Boolean)
    .join(' ')
  const style = {
    boxShadow: safeElevation === 0
      ? 'none'
      : `0 ${safeElevation}px ${safeElevation * 2}px rgb(28 25 23 / 16%)`,
  } satisfies CSSProperties

  return (
    <header className={classNames} style={style}>
      <div className="custom-app-bar__content">
        {children}
      </div>
      {visibleActions != null && (
        <div className="custom-app-bar__actions">{visibleActions}</div>
      )}
    </header>
  )
}
