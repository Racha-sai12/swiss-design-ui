import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type WheelEvent,
} from 'react'
import Field, {
  type FieldProps,
} from './Field.js'

export type NumericFieldProps = Omit<FieldProps, 'children'> & {
  value?: number | null
  defaultValue?: number | null
  valueChanged?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  hideSpinButtons?: boolean
  invertMouseWheel?: boolean
  clearable?: boolean
  clearIcon?: string
  pattern?: string
  immediate?: boolean
  debounceInterval?: number
  format?: string
  culture?: string
  readOnly?: boolean
  name?: string
}

const iconCharacters: Record<string, string> = {
  Clear: '×',
  Close: '×',
  Remove: '×',
}

function getNumberFormat(format: string | undefined, culture: string) {
  if (!format) {
    return new Intl.NumberFormat(culture, {
      maximumFractionDigits: 12,
      useGrouping: false,
    })
  }

  const standardFormat = /^([fFnN])(\d*)$/.exec(format)
  if (standardFormat) {
    const digits = Number(standardFormat[2] || 2)
    return new Intl.NumberFormat(culture, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      useGrouping: standardFormat[1].toLowerCase() === 'n',
    })
  }

  const maximumFractionDigits = Math.max(
    0,
    (format.split('.')[1]?.replace(/[^0#]/g, '').length ?? 0),
  )
  return new Intl.NumberFormat(culture, {
    maximumFractionDigits,
    useGrouping: format.includes(','),
  })
}

function formatNumber(value: number | null, formatter: Intl.NumberFormat) {
  return value === null || !Number.isFinite(value) ? '' : formatter.format(value)
}

function formatEditableNumber(value: number | null, culture: string) {
  if (value === null || !Number.isFinite(value)) return ''
  return new Intl.NumberFormat(culture, {
    maximumFractionDigits: 12,
    useGrouping: false,
  }).format(value)
}

function parseNumber(text: string, culture: string) {
  const parts = new Intl.NumberFormat(culture).formatToParts(-12345.6)
  const digitFormatter = new Intl.NumberFormat(culture, { useGrouping: false })
  const localizedDigits = new Map(
    Array.from({ length: 10 }, (_, digit) => [digitFormatter.format(digit), String(digit)]),
  )
  const group = parts.find((part) => part.type === 'group')?.value
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-'
  let normalized = text.trim()

  if (group) normalized = normalized.split(group).join('')
  if (decimal !== '.') normalized = normalized.replace(decimal, '.')
  if (minus !== '-') normalized = normalized.replace(minus, '-')
  normalized = [...normalized]
    .map((character) => localizedDigits.get(character) ?? character)
    .join('')
    .replace(/[\u00a0\u202f\u061c\u200e\u200f]/g, '')

  if (normalized === '') {
    return null
  }
  if (normalized === '-' || normalized === '.' || normalized === '-.') return undefined

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

function patternAllows(text: string, pattern: RegExp | undefined) {
  if (!pattern) return true
  const fullPattern = new RegExp(`^(?:${pattern.source})$`, pattern.flags.replace(/[gy]/g, ''))
  if (fullPattern.test(text)) return true
  if (pattern.source.startsWith('[')) {
    return [...text].every((character) => pattern.test(character))
  }
  return false
}

function stepPrecision(step: number) {
  const value = step.toString().toLowerCase()
  const [coefficient, exponentText] = value.split('e')
  const fractionDigits = coefficient.split('.')[1]?.length ?? 0
  return Math.max(0, fractionDigits - Number(exponentText ?? 0))
}

export default function NumericField({
  value,
  defaultValue,
  valueChanged,
  min,
  max,
  step = 1,
  hideSpinButtons = false,
  invertMouseWheel = false,
  clearable = false,
  clearIcon = 'Clear',
  pattern,
  immediate = false,
  debounceInterval = 0,
  format,
  culture,
  readOnly = false,
  name,
  label,
  variant = 'Text',
  margin = 'None',
  underline = true,
  innerPadding = false,
  fullWidth = false,
  typo,
  shrinkLabel = false,
  adornment = 'None',
  adornmentIcon,
  adornmentText,
  adornmentColor,
  adornmentAriaLabel,
  iconSize,
  disabled = false,
  error = false,
  errorText,
  helperText,
  onAdornmentClick,
  className,
  id,
}: NumericFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const locale = culture ?? (typeof navigator === 'undefined' ? 'en-US' : navigator.language)
  const formatter = useMemo(() => getNumberFormat(format, locale), [format, locale])
  const patternRegExp = useMemo(() => {
    if (!pattern) return undefined
    try {
      return new RegExp(pattern)
    } catch (cause) {
      throw new Error(`NumericField received an invalid pattern: ${String(cause)}`)
    }
  }, [pattern])
  const controlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(
    () => value ?? defaultValue ?? null,
  )
  const currentValue = controlled ? value ?? null : uncontrolledValue
  const [draft, setDraft] = useState(() => formatNumber(currentValue, formatter))
  const [editing, setEditing] = useState(false)
  const [patternError, setPatternError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const numericStep = Number.isFinite(step) && step > 0 ? step : 1
  const isDisabled = disabled
  const isReadOnly = readOnly || disabled
  const currentFormattedValue = formatNumber(currentValue, formatter)
  const hasValue = currentValue !== null
  const clearCharacter = iconCharacters[clearIcon] ?? clearIcon
  const rangeError = currentValue !== null && (
    min !== undefined && currentValue < min ||
    max !== undefined && currentValue > max
  )

  if (min !== undefined && max !== undefined && min > max) {
    throw new RangeError('NumericField min must be less than or equal to max.')
  }
  if (!Number.isFinite(step) || step <= 0) {
    throw new RangeError('NumericField step must be a positive finite number.')
  }

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  const updateValue = (nextValue: number | null) => {
    if (nextValue !== null) {
      if (!Number.isFinite(nextValue)) return
      if (min !== undefined && nextValue < min) return
      if (max !== undefined && nextValue > max) return
    }
    if (!controlled) setUncontrolledValue(nextValue)
    valueChanged?.(nextValue)
    setPatternError(false)
  }

  const parseAndUpdate = (text: string) => {
    if (!patternAllows(text, patternRegExp)) {
      setPatternError(true)
      return false
    }
    const nextValue = parseNumber(text, locale)
    if (nextValue === undefined) {
      setPatternError(true)
      return false
    }
    if (nextValue !== null && (
      min !== undefined && nextValue < min ||
      max !== undefined && nextValue > max
    )) {
      setPatternError(true)
      return false
    }
    updateValue(nextValue)
    return true
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawDraft = event.target.value
    const nextDraft = patternRegExp?.source.startsWith('[')
      ? [...rawDraft].filter((character) => patternRegExp.test(character)).join('')
      : rawDraft
    setDraft(nextDraft)
    setPatternError(!patternAllows(nextDraft, patternRegExp))

    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }

    if (immediate && debounceInterval <= 0) {
      parseAndUpdate(nextDraft)
    } else if (immediate || debounceInterval > 0) {
      timer.current = setTimeout(
        () => {
          parseAndUpdate(nextDraft)
          timer.current = null
        },
        Math.max(0, debounceInterval),
      )
    }
  }

  const commitDraft = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    const committed = parseAndUpdate(draft)
    setEditing(false)
    setDraft(committed ? formatNumber(
      parseNumber(draft, locale) ?? null,
      formatter,
    ) : currentFormattedValue)
  }

  const applyStep = (direction: 1 | -1) => {
    if (isReadOnly) return
    const currentDraftValue = parseNumber(draft, locale)
    const baseValue = currentDraftValue ?? currentValue ?? 0
    const precision = Math.max(stepPrecision(numericStep), stepPrecision(baseValue))
    const nextValue = Number((baseValue + direction * numericStep).toFixed(precision))
    const boundedValue = Math.min(max ?? Number.POSITIVE_INFINITY, Math.max(min ?? Number.NEGATIVE_INFINITY, nextValue))
    inputRef.current?.focus()
    updateValue(boundedValue)
    setDraft(formatNumber(boundedValue, formatter))
    setEditing(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      applyStep(event.key === 'ArrowUp' ? 1 : -1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      commitDraft()
      inputRef.current?.blur()
    } else if (event.key === 'Escape') {
      setDraft(currentFormattedValue)
      setPatternError(false)
      setEditing(false)
      inputRef.current?.blur()
    }
  }

  const handleWheel = (event: WheelEvent<HTMLInputElement>) => {
    if (document.activeElement !== event.currentTarget || isReadOnly) return
    event.preventDefault()
    const wheelDirection = event.deltaY < 0 ? 1 : -1
    applyStep((invertMouseWheel ? -wheelDirection : wheelDirection) as 1 | -1)
  }

  const clearValue = () => {
    if (isReadOnly) return
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    inputRef.current?.focus()
    updateValue(null)
    setDraft('')
    setPatternError(false)
    setEditing(false)
  }

  const invalid = error || patternError || rangeError
  const validationMessage = patternError || rangeError
    ? 'Enter a valid number within the allowed range.'
    : errorText
  const rootClassName = ['numeric-field', className].filter(Boolean).join(' ')

  return (
    <Field
      id={`${inputId}-frame`}
      className={rootClassName}
      label={label}
      variant={variant}
      margin={margin}
      underline={underline}
      innerPadding={innerPadding}
      fullWidth={fullWidth}
      typo={typo}
      shrinkLabel={shrinkLabel || editing || hasValue}
      adornment={adornment}
      adornmentIcon={adornmentIcon}
      adornmentText={adornmentText}
      adornmentColor={adornmentColor}
      adornmentAriaLabel={adornmentAriaLabel}
      iconSize={iconSize}
      disabled={disabled}
      error={invalid}
      errorText={validationMessage}
      helperText={patternError ? undefined : helperText}
      onAdornmentClick={onAdornmentClick}
    >
      <div className="numeric-field__control">
        <input
          ref={inputRef}
          id={inputId}
          className="numeric-field__input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          name={name}
          value={editing ? draft : currentFormattedValue}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-label={label ?? 'Numeric value'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue ?? undefined}
          aria-invalid={invalid || undefined}
          onFocus={() => {
            setEditing(true)
            setDraft(formatEditableNumber(currentValue, locale))
          }}
          onChange={handleChange}
          onBlur={commitDraft}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
        />
        {!hideSpinButtons && (
          <span className="numeric-field__spin-buttons">
            <button
              type="button"
              aria-label={`Increase ${label ?? 'value'}`}
              disabled={isReadOnly || max !== undefined && currentValue !== null && currentValue >= max}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyStep(1)}
            >▲</button>
            <button
              type="button"
              aria-label={`Decrease ${label ?? 'value'}`}
              disabled={isReadOnly || min !== undefined && currentValue !== null && currentValue <= min}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyStep(-1)}
            >▼</button>
          </span>
        )}
        {clearable && hasValue && (
          <button
            className="numeric-field__clear"
            type="button"
            aria-label={`Clear ${label ?? 'value'}`}
            disabled={isReadOnly}
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearValue}
          >
            {clearCharacter}
          </button>
        )}
      </div>
    </Field>
  )
}
