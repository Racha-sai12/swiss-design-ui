import {
  Children,
  isValidElement,
  useState,
  useId,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import type {
  FieldAdornment,
  FieldAdornmentColor,
  FieldIconSize,
  FieldMargin,
  FieldTypo,
  FieldVariant,
} from '../styles/types.js'

export type {
  FieldAdornment,
  FieldAdornmentColor,
  FieldIconSize,
  FieldMargin,
  FieldTypo,
  FieldVariant,
} from '../styles/types.js'

export type FieldProps = {
  variant?: FieldVariant
  margin?: FieldMargin
  underline?: boolean
  innerPadding?: boolean
  fullWidth?: boolean
  typo?: FieldTypo
  shrinkLabel?: boolean
  adornment?: FieldAdornment
  adornmentIcon?: string
  adornmentText?: string
  adornmentColor?: FieldAdornmentColor
  adornmentAriaLabel?: string
  iconSize?: FieldIconSize
  disabled?: boolean
  error?: boolean
  errorText?: string
  helperText?: string
  label?: string
  children: ReactNode
  onAdornmentClick?: (event: MouseEvent<HTMLButtonElement>) => void
  className?: string
  id?: string
}

const iconCharacters: Record<string, string> = {
  Add: '+',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  Calendar: '▦',
  Check: '✓',
  Close: '×',
  Info: 'i',
  Search: '⌕',
  Star: '☆',
}

function containsValue(children: ReactNode): boolean {
  let hasValue = false
  Children.forEach(children, (child) => {
    if (hasValue) return
    if (typeof child === 'string' || typeof child === 'number') {
      hasValue = String(child).trim().length > 0
      return
    }
    if (!isValidElement(child)) return
    const props = child.props as {
      value?: unknown
      defaultValue?: unknown
      children?: ReactNode
    }
    if (
      props.value !== undefined && props.value !== null && props.value !== '' ||
      props.defaultValue !== undefined && props.defaultValue !== null && props.defaultValue !== ''
    ) {
      hasValue = true
    } else if (props.children !== undefined && containsValue(props.children)) {
      hasValue = true
    }
  })
  return hasValue
}

export default function Field({
  variant = 'Text',
  margin = 'None',
  underline = true,
  innerPadding = false,
  fullWidth = false,
  typo = 'Body1',
  shrinkLabel = false,
  adornment = 'None',
  adornmentIcon,
  adornmentText,
  adornmentColor = 'Default',
  adornmentAriaLabel,
  iconSize = 'Medium',
  disabled = false,
  error = false,
  errorText,
  helperText,
  label,
  children,
  onAdornmentClick,
  className,
  id,
}: FieldProps) {
  const [focused, setFocused] = useState(false)
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hasContent = containsValue(children)
  const labelShrunk = shrinkLabel || focused || hasContent
  const labelId = `${fieldId}-label`
  const descriptionId = `${fieldId}-description`
  const message = error && errorText ? errorText : helperText
  const hasMessage = Boolean(message)
  const icon = adornmentText ? undefined : adornmentIcon
    ? iconCharacters[adornmentIcon] ?? adornmentIcon
    : undefined
  const interactiveAdornment = onAdornmentClick !== undefined
  const classes = [
    'field',
    `field--${variant.toLowerCase()}`,
    `field--margin-${margin.toLowerCase()}`,
    `field--typo-${typo.toLowerCase()}`,
    `field--adornment-${adornment.toLowerCase()}`,
    `field--adornment-color-${adornmentColor.toLowerCase()}`,
    `field--icon-${iconSize.toLowerCase()}`,
    underline && 'field--underline',
    innerPadding && 'field--inner-padding',
    fullWidth && 'field--full-width',
    labelShrunk && 'field--label-shrunk',
    focused && 'field--focused',
    disabled && 'field--disabled',
    error && 'field--error',
    className,
  ].filter(Boolean).join(' ')

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocused(false)
    }
  }

  return (
    <div
      className={classes}
      id={fieldId}
      aria-disabled={disabled || undefined}
      aria-invalid={error || undefined}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
    >
      <div className={`field__frame${variant === 'Outlined' ? ' field__frame--outlined' : ''}`}>
        {label && variant === 'Outlined' && labelShrunk && (
          <div className="field__outline-notch" aria-hidden="true">
            <span className="field__outline-line" />
            <span className="field__label" id={labelId}>{label}</span>
            <span className="field__outline-line" />
          </div>
        )}
        {label && !(variant === 'Outlined' && labelShrunk) && (
          <span className="field__label" id={labelId}>
            {label}
          </span>
        )}
        {adornment !== 'None' && adornment === 'Start' && (
          <AdornmentContent
            text={adornmentText}
            icon={icon}
            ariaLabel={adornmentAriaLabel}
            disabled={disabled}
            interactive={interactiveAdornment}
            onClick={onAdornmentClick}
          />
        )}
        <div
          className="field__content"
          role={label ? 'group' : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={hasMessage ? descriptionId : undefined}
          aria-invalid={error || undefined}
          inert={disabled}
        >
          {children}
        </div>
        {adornment !== 'None' && adornment === 'End' && (
          <AdornmentContent
            text={adornmentText}
            icon={icon}
            ariaLabel={adornmentAriaLabel}
            disabled={disabled}
            interactive={interactiveAdornment}
            onClick={onAdornmentClick}
          />
        )}
      </div>
      {hasMessage && (
        <div
          className="field__message"
          id={descriptionId}
          role={error ? 'alert' : undefined}
          aria-live={error ? 'polite' : undefined}
        >
          {message}
        </div>
      )}
    </div>
  )
}

function AdornmentContent({
  text,
  icon,
  ariaLabel,
  disabled,
  interactive,
  onClick,
}: {
  text?: string
  icon?: string
  ariaLabel?: string
  disabled: boolean
  interactive: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  const content = text ?? icon
  if (!content) return null

  if (interactive) {
    return (
      <button
        className="field__adornment field__adornment-button"
        type="button"
        aria-label={ariaLabel ?? text ?? 'Field action'}
        disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return (
    <span
      className="field__adornment"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {content}
    </span>
  )
}
