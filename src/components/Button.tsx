import type {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  CSSProperties,
} from 'react'
import type { ButtonColor, ButtonSize, ButtonVariant, IconSize } from '../styles/types.js'

type ButtonType = 'button' | 'submit' | 'reset'
type ButtonTag = 'button' | 'div' | 'span'

export type ButtonProps = {
  color?: ButtonColor
  variant?: ButtonVariant
  size?: ButtonSize
  dense?: boolean
  disableElevation?: boolean
  dropShadow?: boolean
  ripple?: boolean
  fullWidth?: boolean
  customColor?: string
  label?: string
  children?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
  iconSize?: IconSize
  ariaLabel?: string
  disabled?: boolean
  buttonType?: ButtonType
  htmlTag?: ButtonTag
  href?: string
  target?: '_self' | '_blank'
  onClick?: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
}

const namedIcons: Record<string, string> = {
  Add: '+',
  ArrowRight: '→',
  Check: '✓',
  Close: '×',
  Search: '⌕',
}

function renderIcon(icon: ReactNode, iconSize: IconSize, position: 'start' | 'end') {
  if (icon == null || icon === false) {
    return null
  }

  const iconContent = typeof icon === 'string' ? namedIcons[icon] ?? icon : icon

  return (
    <span
      className={`custom-button__icon custom-button__icon--${position} custom-button__icon--${iconSize.toLowerCase()}`}
      aria-hidden="true"
    >
      {iconContent}
    </span>
  )
}

export default function Button({
  color = 'Default',
  variant = 'Text',
  size = 'Medium',
  dense = false,
  disableElevation = false,
  dropShadow = false,
  ripple = false,
  fullWidth = false,
  customColor,
  label,
  children,
  startIcon,
  endIcon,
  iconSize = 'Medium',
  ariaLabel,
  disabled = false,
  buttonType = 'button',
  htmlTag = 'button',
  href,
  target = '_self',
  onClick,
}: ButtonProps) {
  const classNames = [
    'custom-button',
    `custom-button--${color.toLowerCase()}`,
    `custom-button--${variant.toLowerCase()}`,
    `custom-button--${size.toLowerCase()}`,
    `custom-button--icon-${iconSize.toLowerCase()}`,
    dense && 'custom-button--dense',
    disableElevation && 'custom-button--flat',
    dropShadow && !disableElevation && 'custom-button--shadow',
    ripple && 'custom-button--ripple',
    fullWidth && 'custom-button--full-width',
    customColor && 'custom-button--custom-color',
    disabled && 'custom-button--disabled',
  ]
    .filter(Boolean)
    .join(' ')
  const style: CSSProperties & { '--button-custom-color'?: string } = customColor
    ? { '--button-custom-color': customColor }
    : {}
  const content = children ?? label

  const innerContent = (
    <>
      {renderIcon(startIcon, iconSize, 'start')}
      {content != null && <span className="custom-button__label">{content}</span>}
      {renderIcon(endIcon, iconSize, 'end')}
    </>
  )

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!disabled) {
      onClick?.(event)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    onClick?.(event)
  }

  if (href !== undefined) {
    return (
      <a
        className={classNames}
        style={style}
        aria-label={ariaLabel}
        href={disabled ? undefined : href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
      >
        {innerContent}
      </a>
    )
  }

  if (htmlTag === 'button') {
    return (
      <button
        className={classNames}
        style={style}
        aria-label={ariaLabel}
        type={buttonType}
        disabled={disabled}
        onClick={handleClick}
      >
        {innerContent}
      </button>
    )
  }

  const Element = htmlTag

  return (
    <Element
      className={classNames}
      style={style}
      aria-label={ariaLabel}
      role="button"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {innerContent}
    </Element>
  )
}
