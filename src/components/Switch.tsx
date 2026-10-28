import { useId, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { SwitchColor, SwitchLabelPlacement, SwitchSize } from '../styles/types.js'

export type { SwitchColor, SwitchLabelPlacement, SwitchSize } from '../styles/types.js'

export type SwitchProps<T = boolean> = {
  value?: T
  valueChanged?: (value: T) => void
  checked?: T
  checkedChanged?: (value: T) => void
  defaultValue?: T
  defaultChecked?: T
  trueValue?: T
  falseValue?: T
  color?: SwitchColor
  uncheckedColor?: SwitchColor
  thumbIcon?: string
  thumbIconColor?: SwitchColor
  label?: string
  labelPlacement?: SwitchLabelPlacement
  size?: SwitchSize
  ripple?: boolean
  dense?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  errorText?: string
  required?: boolean
  ariaLabel?: string
  name?: string
  id?: string
  className?: string
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
}

function iconContent(icon: string) {
  const icons: Record<string, string> = {
    Check: '✓',
    Close: '×',
    Minus: '−',
    Star: '☆',
  }
  return icons[icon] ?? icon
}

export default function Switch<T = boolean>({
  value,
  valueChanged,
  checked,
  checkedChanged,
  defaultValue,
  defaultChecked,
  trueValue,
  falseValue,
  color = 'Default',
  uncheckedColor = 'Default',
  thumbIcon,
  thumbIconColor = 'Default',
  label,
  labelPlacement = 'End',
  size = 'Medium',
  ripple = true,
  dense = false,
  disabled = false,
  readOnly = false,
  error = false,
  errorText,
  required = false,
  ariaLabel,
  name,
  id,
  className,
  onClick,
}: SwitchProps<T>) {
  const generatedId = useId()
  const switchId = id ?? generatedId
  const errorId = `${switchId}-error`
  const onValue = trueValue ?? (true as T)
  const offValue = falseValue ?? (false as T)
  const isControlled = value !== undefined || checked !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    () => defaultValue ?? defaultChecked ?? offValue,
  )
  const currentValue = value !== undefined
    ? value
    : checked !== undefined
      ? checked
      : uncontrolledValue
  const isOn = Object.is(currentValue, onValue)
  const message = error && errorText ? errorText : undefined

  const changeValue = (nextValue: T) => {
    if (disabled || readOnly || Object.is(currentValue, nextValue)) return
    if (!isControlled) setUncontrolledValue(nextValue)
    valueChanged?.(nextValue)
    checkedChanged?.(nextValue)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    let nextValue: T | undefined
    if (event.key === 'ArrowLeft' || event.key === 'Delete') nextValue = offValue
    if (event.key === 'ArrowRight' || event.key === 'Enter') nextValue = onValue
    if (event.key === ' ' || event.key === 'Spacebar') nextValue = isOn ? offValue : onValue
    if (nextValue !== undefined) {
      event.preventDefault()
      changeValue(nextValue)
    }
  }

  const classes = [
    'switch',
    `switch--${size.toLowerCase()}`,
    `switch--label-${labelPlacement.toLowerCase()}`,
    `switch--color-${color.toLowerCase()}`,
    `switch--unchecked-${uncheckedColor.toLowerCase()}`,
    `switch--thumb-icon-${thumbIconColor.toLowerCase()}`,
    dense && 'switch--dense',
    disabled && 'switch--disabled',
    readOnly && 'switch--readonly',
    error && 'switch--error',
    ripple && 'switch--ripple',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <label className="switch__label" htmlFor={switchId}>
        {labelPlacement === 'Start' || labelPlacement === 'Top' ? (
          label && <span className="switch__text">{label}</span>
        ) : null}
        <span className="switch__control">
          <input
            id={switchId}
            className="switch__input"
            type="checkbox"
            role="switch"
            name={name}
            value={String(onValue)}
            checked={isOn}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-checked={isOn}
            aria-readonly={readOnly || undefined}
            aria-invalid={error || undefined}
            aria-describedby={message ? errorId : undefined}
            onChange={(event) => changeValue(event.currentTarget.checked ? onValue : offValue)}
            onKeyDown={handleKeyDown}
            onClick={onClick}
            onClickCapture={(event) => {
              if (readOnly) event.preventDefault()
            }}
          />
          <span className="switch__track" aria-hidden="true">
            <span className="switch__thumb">
              {thumbIcon && <span className="switch__thumb-icon">{iconContent(thumbIcon)}</span>}
            </span>
          </span>
        </span>
        {labelPlacement === 'End' || labelPlacement === 'Bottom' ? (
          label && <span className="switch__text">{label}</span>
        ) : null}
      </label>
      {message && (
        <div className="switch__error" id={errorId} role="alert" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  )
}
