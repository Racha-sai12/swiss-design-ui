import type {
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'
import type { CardColor, MediaFit } from '../styles/types.js'

export type CardProps = {
  elevation?: number
  outlined?: boolean
  square?: boolean
  color?: CardColor
  className?: string
  style?: CSSProperties
  clickable?: boolean
  href?: string
  target?: '_self' | '_blank'
  onClick?: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
  children: ReactNode
}

export type CardHeaderProps = {
  avatar?: ReactNode
  title?: string
  subtitle?: string
  actionContent?: ReactNode
  children?: ReactNode
}

export type CardMediaProps = {
  src: string
  alt: string
  height?: number
  fit?: MediaFit
}

function Card({
  elevation = 1,
  outlined = false,
  square = false,
  color = 'Default',
  className,
  style,
  clickable = false,
  href,
  target = '_self',
  onClick,
  children,
}: CardProps) {
  const safeElevation = Number.isFinite(elevation)
    ? Math.max(0, Math.min(24, Math.trunc(elevation)))
    : 0
  const isLink = href !== undefined
  const isInteractive = isLink || clickable || onClick !== undefined
  const classNames = [
    'custom-card',
    `custom-card--${color.toLowerCase()}`,
    outlined && 'custom-card--outlined',
    square && 'custom-card--square',
    isInteractive && 'custom-card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const cardStyle: CSSProperties = {
    boxShadow: safeElevation === 0
      ? 'none'
      : `0 ${safeElevation}px ${safeElevation * 3}px rgb(28 25 23 / 12%)`,
    ...style,
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const targetElement = event.target
    const nestedControl = targetElement instanceof Element
      ? targetElement.closest('a, button, input, textarea, select, [contenteditable="true"], [role="button"]')
      : null

    if (
      nestedControl !== null &&
      nestedControl !== event.currentTarget
    ) {
      return
    }

    onClick?.(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      event.target !== event.currentTarget ||
      (event.key !== 'Enter' && event.key !== ' ')
    ) {
      return
    }

    event.preventDefault()
    onClick?.(event)
  }

  if (isLink) {
    return (
      <a
        className={classNames}
        style={cardStyle}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        onClick={onClick ? (event) => onClick(event) : undefined}
      >
        {children}
      </a>
    )
  }

  return (
    <article
      className={classNames}
      style={cardStyle}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
    >
      {children}
    </article>
  )
}

function CardHeader({ avatar, title, subtitle, actionContent, children }: CardHeaderProps) {
  return (
    <header className="custom-card__header">
      {avatar != null && <div className="custom-card__avatar">{avatar}</div>}
      {children ?? <CardHeaderContent title={title} subtitle={subtitle} />}
      {actionContent != null && (
        <div className="custom-card__header-action">{actionContent}</div>
      )}
    </header>
  )
}

function CardHeaderContent({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="custom-card__header-content">
      {title != null && <h3 className="custom-card__title">{title}</h3>}
      {subtitle != null && <p className="custom-card__subtitle">{subtitle}</p>}
    </div>
  )
}

function CardMedia({ src, alt, height = 192, fit = 'Cover' }: CardMediaProps) {
  const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 192

  return (
    <img
      className={`custom-card__media custom-card__media--${fit.toLowerCase()}`}
      src={src}
      alt={alt}
      style={{ height: safeHeight }}
    />
  )
}

function CardContent({ children }: { children: ReactNode }) {
  return <div className="custom-card__content">{children}</div>
}

function Divider() {
  return <hr className="custom-card__divider" />
}

function CardActions({ children }: { children: ReactNode }) {
  return <div className="custom-card__actions">{children}</div>
}

const CardWithParts = Object.assign(Card, {
  Header: CardHeader,
  HeaderContent: CardHeaderContent,
  Media: CardMedia,
  Content: CardContent,
  Divider,
  Actions: CardActions,
})

export default CardWithParts
