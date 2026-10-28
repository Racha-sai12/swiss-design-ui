import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'
import type { RadioColor, RadioPlacement, RadioSize } from '../styles/types.js'

export type { RadioColor, RadioPlacement, RadioSize } from '../styles/types.js'

type RadioGroupContextValue = {
  name: string
  selectedValue: unknown
  disabled: boolean
  readOnly: boolean
  color: RadioColor
  uncheckedColor: RadioColor
  dense: boolean
  size: RadioSize
  placement: RadioPlacement
  disableRipple: boolean
  required: boolean
  selectValue: (value: unknown) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export type RadioGroupProps<T> = {
  value?: T | null
  defaultValue?: T | null
  valueChanged?: (value: T) => void
  disabled?: boolean
  readOnly?: boolean
  name?: string
  label?: string
  children: ReactNode
  required?: boolean
  error?: boolean
  errorText?: string
  color?: RadioColor
  unCheckedColor?: RadioColor
  dense?: boolean
  size?: RadioSize
  placement?: RadioPlacement
  disableRipple?: boolean
  className?: string
  id?: string
}

export function RadioGroup<T>({
  value,
  defaultValue,
  valueChanged,
  disabled = false,
  readOnly = false,
  name,
  label,
  children,
  required = false,
  error = false,
  errorText,
  color = 'Primary',
  unCheckedColor = 'Default',
  dense = false,
  size = 'Medium',
  placement = 'Right',
  disableRipple = false,
  className,
  id,
}: RadioGroupProps<T>) {
  const generatedId = useId()
  const groupName = name ?? `radio-group-${generatedId}`
  const groupId = id ?? generatedId
  const [uncontrolledValue, setUncontrolledValue] = useState<T | null>(
    () => value ?? defaultValue ?? null,
  )
  const isControlled = value !== undefined
  const selectedValue = isControlled ? value : uncontrolledValue
  const context: RadioGroupContextValue = {
    name: groupName,
    selectedValue,
    disabled,
    readOnly,
    color,
    uncheckedColor: unCheckedColor,
    dense,
    size,
    placement,
    disableRipple,
    required,
    selectValue: (nextValue) => {
      if (disabled || readOnly) return
      if (!isControlled) setUncontrolledValue(nextValue as T)
      valueChanged?.(nextValue as T)
    },
  }
  const classes = [
    'radio-group',
    dense && 'radio-group--dense',
    disabled && 'radio-group--disabled',
    readOnly && 'radio-group--readonly',
    error && 'radio-group--error',
    className,
  ].filter(Boolean).join(' ')
  const errorId = `${groupId}-error`

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        id={groupId}
        className={classes}
        disabled={disabled}
        role="radiogroup"
        aria-required={required || undefined}
        aria-invalid={error || undefined}
        aria-describedby={error && errorText ? errorId : undefined}
        aria-readonly={readOnly || undefined}
      >
        {label && <legend className="radio-group__label">{label}</legend>}
        {children}
        {error && errorText && (
          <div className="radio-group__error" id={errorId} role="alert">
            {errorText}
          </div>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  )
}

export type RadioProps<T> = {
  value: T
  children: ReactNode
  color?: RadioColor
  unCheckedColor?: RadioColor
  dense?: boolean
  size?: RadioSize
  placement?: RadioPlacement
  disableRipple?: boolean
  disabled?: boolean
  className?: string
  id?: string
}

export function Radio<T>({
  value,
  children,
  color,
  unCheckedColor,
  dense,
  size,
  placement,
  disableRipple,
  disabled = false,
  className,
  id,
}: RadioProps<T>) {
  const context = useContext(RadioGroupContext)
  const generatedId = useId()
  const radioId = id ?? generatedId
  const resolvedColor = color ?? context?.color ?? 'Primary'
  const resolvedUncheckedColor = unCheckedColor ?? context?.uncheckedColor ?? 'Default'
  const resolvedSize = size ?? context?.size ?? 'Medium'
  const resolvedPlacement = placement ?? context?.placement ?? 'Right'
  const isDense = dense ?? context?.dense ?? false
  const isDisabled = disabled || context?.disabled === true
  const isReadOnly = context?.readOnly === true
  const isChecked = context ? Object.is(context.selectedValue, value) : false
  const classes = [
    'radio-option',
    `radio-option--${resolvedPlacement.toLowerCase()}`,
    `radio-option--${resolvedSize.toLowerCase()}`,
    `radio-option--color-${resolvedColor.toLowerCase()}`,
    `radio-option--unchecked-${resolvedUncheckedColor.toLowerCase()}`,
    isDense && 'radio-option--dense',
    (disableRipple ?? context?.disableRipple ?? false) && 'radio-option--no-ripple',
    isDisabled && 'radio-option--disabled',
    isReadOnly && 'radio-option--readonly',
    className,
  ].filter(Boolean).join(' ')

  const control = (
    <span className="radio-option__control">
      <input
        className="radio-option__input"
        id={radioId}
        type="radio"
        name={context?.name}
        value={String(value)}
        checked={isChecked}
        disabled={isDisabled}
        required={context?.required}
        onChange={() => context?.selectValue(value)}
        onClick={(event) => {
          if (isReadOnly) event.preventDefault()
        }}
      />
      <span className="radio-option__indicator" aria-hidden="true">
        <span />
      </span>
    </span>
  )
  const label = <span className="radio-option__label">{children}</span>

  return (
    <label className={classes} htmlFor={radioId}>
      {resolvedPlacement === 'Left' || resolvedPlacement === 'Start' ? (
        <>{label}{control}</>
      ) : (
        <>{control}{label}</>
      )}
    </label>
  )
}

export default RadioGroup
