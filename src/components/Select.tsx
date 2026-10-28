import {
  Children,
  Fragment,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { SelectOrigin } from '../styles/types.js'
import Field, {
  type FieldAdornment,
  type FieldAdornmentColor,
  type FieldIconSize,
  type FieldMargin,
  type FieldVariant,
} from './Field.js'

export type { SelectOrigin } from '../styles/types.js'

export type SelectProps<T> = {
  value?: T | null
  defaultValue?: T | null
  valueChanged?: (value: T | null) => void
  multiSelection?: boolean
  selectedValues?: readonly T[]
  defaultSelectedValues?: readonly T[]
  selectedValuesChanged?: (values: readonly T[]) => void
  delimiter?: string
  multiSelectionTextFunc?: (values: readonly T[]) => string
  comparer?: (left: T, right: T) => boolean
  anchorOrigin?: SelectOrigin
  transformOrigin?: SelectOrigin
  dense?: boolean
  maxHeight?: number
  lockScroll?: boolean
  fitContent?: boolean
  clearable?: boolean
  closeIcon?: string
  checkedIcon?: string
  indeterminateIcon?: string
  listClass?: string
  inputClass?: string
  label?: string
  variant?: FieldVariant
  margin?: FieldMargin
  adornment?: FieldAdornment
  adornmentIcon?: string
  adornmentText?: string
  adornmentColor?: FieldAdornmentColor
  adornmentAriaLabel?: string
  iconSize?: FieldIconSize
  helperText?: string
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  errorText?: string
  fullWidth?: boolean
  name?: string
  id?: string
  className?: string
  children: ReactNode
  onAdornmentClick?: (event: ReactMouseEvent<HTMLButtonElement>) => void
}

export type SelectItemProps<T> = {
  value: T
  children: ReactNode
  disabled?: boolean
}

const originStyles: Record<SelectOrigin, { x: number; y: number; css: string }> = {
  TopLeft: { x: 0, y: 0, css: 'left top' },
  TopCenter: { x: 0.5, y: 0, css: 'center top' },
  TopRight: { x: 1, y: 0, css: 'right top' },
  CenterLeft: { x: 0, y: 0.5, css: 'left center' },
  Center: { x: 0.5, y: 0.5, css: 'center center' },
  CenterRight: { x: 1, y: 0.5, css: 'right center' },
  BottomLeft: { x: 0, y: 1, css: 'left bottom' },
  BottomCenter: { x: 0.5, y: 1, css: 'center bottom' },
  BottomRight: { x: 1, y: 1, css: 'right bottom' },
}

function iconContent(icon: string) {
  const icons: Record<string, string> = {
    Check: '✓',
    Close: '×',
    Clear: '×',
    ExpandMore: '⌄',
    Indeterminate: '−',
  }
  return icons[icon] ?? icon
}

function sameValue<T>(comparer: (left: T, right: T) => boolean, left: T, right: T) {
  return comparer(left, right)
}

function usePopoverPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>,
  anchorOrigin: SelectOrigin,
  transformOrigin: SelectOrigin,
) {
  const [position, setPosition] = useState<CSSProperties>({})

  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const anchor = triggerRef.current
      const menu = menuRef.current
      if (!anchor || !menu) return
      const anchorRect = anchor.getBoundingClientRect()
      const menuRect = menu.getBoundingClientRect()
      const anchorPoint = originStyles[anchorOrigin]
      const transformPoint = originStyles[transformOrigin]
      setPosition({
        position: 'fixed',
        left: anchorRect.left + anchorRect.width * anchorPoint.x - menuRect.width * transformPoint.x,
        top: anchorRect.top + anchorRect.height * anchorPoint.y - menuRect.height * transformPoint.y,
        minWidth: anchorRect.width,
        transformOrigin: transformPoint.css,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, triggerRef, menuRef, anchorOrigin, transformOrigin])

  return position
}

export function SelectItem<T>(_props: SelectItemProps<T>) {
  return null
}

export default function Select<T>({
  value,
  defaultValue,
  valueChanged,
  multiSelection = false,
  selectedValues,
  defaultSelectedValues = [],
  selectedValuesChanged,
  delimiter = ', ',
  multiSelectionTextFunc,
  comparer = Object.is,
  anchorOrigin = 'BottomLeft',
  transformOrigin = 'TopLeft',
  dense = false,
  maxHeight = 300,
  lockScroll = false,
  fitContent = false,
  clearable = false,
  closeIcon = 'Close',
  checkedIcon = 'Check',
  indeterminateIcon = 'Indeterminate',
  listClass,
  inputClass,
  label,
  variant = 'Outlined',
  margin = 'None',
  adornment = 'None',
  adornmentIcon,
  adornmentText,
  adornmentColor = 'Default',
  adornmentAriaLabel,
  iconSize = 'Medium',
  helperText,
  disabled = false,
  readOnly = false,
  error = false,
  errorText,
  fullWidth = false,
  name,
  id,
  className,
  children,
  onAdornmentClick,
}: SelectProps<T>) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const labelId = `${selectId}-label`
  const [open, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState<T | null>(defaultValue ?? null)
  const [uncontrolledValues, setUncontrolledValues] = useState<readonly T[]>(defaultSelectedValues)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const focusOnOpenRef = useRef(false)
  const focusLastRef = useRef(false)
  const isValueControlled = value !== undefined
  const isValuesControlled = selectedValues !== undefined
  const currentValue = isValueControlled ? value : uncontrolledValue
  const currentValues = isValuesControlled ? selectedValues : uncontrolledValues
  const position = usePopoverPosition(open, triggerRef, menuRef, anchorOrigin, transformOrigin)
  const valuesEqual = (left: T, right: T) => sameValue(comparer, left, right)

  const options = useMemo(() => Children.toArray(children).flatMap((child, index) => {
    if (!isValidElement<SelectItemProps<T>>(child) || !('value' in child.props)) return []
    return [{ ...child.props, key: child.key ?? `select-option-${index}` }]
  }), [children])

  const selectedOptions = multiSelection
    ? options.filter((option) => currentValues.some((selected) => valuesEqual(selected, option.value)))
    : options.filter((option) => currentValue !== null && currentValue !== undefined && valuesEqual(currentValue, option.value))

  const selectedLabels = selectedOptions.map((option) => option.children)
  const displayText: ReactNode = multiSelection
    ? multiSelectionTextFunc?.(selectedOptions.map((option) => option.value))
      ?? selectedLabels.map((selectedLabel, index) => (
        <Fragment key={index}>{index > 0 ? delimiter : null}{selectedLabel}</Fragment>
      ))
    : selectedLabels[0] ?? ''
  const hasSelection = multiSelection ? currentValues.length > 0 : currentValue !== null && currentValue !== undefined

  const closeMenu = () => setOpen(false)
  const openMenu = (focusLast = false) => {
    if (disabled) return
    focusOnOpenRef.current = true
    focusLastRef.current = focusLast
    setOpen(true)
  }

  const selectValue = (nextValue: T) => {
    if (disabled || readOnly) return
    if (multiSelection) {
      const isSelected = currentValues.some((selected) => valuesEqual(selected, nextValue))
      const nextValues = isSelected
        ? currentValues.filter((selected) => !valuesEqual(selected, nextValue))
        : [...currentValues, nextValue]
      if (!isValuesControlled) setUncontrolledValues(nextValues)
      selectedValuesChanged?.(nextValues)
      return
    }
    if (!isValueControlled) setUncontrolledValue(nextValue)
    valueChanged?.(nextValue)
    closeMenu()
    triggerRef.current?.focus()
  }

  const clearValue = () => {
    if (disabled || readOnly) return
    if (multiSelection) {
      if (!isValuesControlled) setUncontrolledValues([])
      selectedValuesChanged?.([])
    } else {
      if (!isValueControlled) setUncontrolledValue(null)
      valueChanged?.(null)
    }
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openMenu()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(true)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      closeMenu()
    }
  }

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabledIndexes = options
      .map((option, optionIndex) => ({ option, optionIndex }))
      .filter(({ option }) => !option.disabled)
      .map(({ optionIndex }) => optionIndex)
    const currentIndex = enabledIndexes.indexOf(index)
    let target: number | undefined
    if (event.key === 'ArrowDown') target = enabledIndexes[(currentIndex + 1) % enabledIndexes.length]
    if (event.key === 'ArrowUp') target = enabledIndexes[(currentIndex - 1 + enabledIndexes.length) % enabledIndexes.length]
    if (event.key === 'Home') target = enabledIndexes[0]
    if (event.key === 'End') target = enabledIndexes.at(-1)
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu()
      triggerRef.current?.focus()
    }
    if (target !== undefined) {
      event.preventDefault()
      optionRefs.current[target]?.focus()
    }
  }

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) closeMenu()
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
        triggerRef.current?.focus()
      }
    }
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) closeMenu()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [open])

  useEffect(() => {
    if (!open || !lockScroll) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open, lockScroll])

  useEffect(() => {
    if (open) {
      optionRefs.current = optionRefs.current.slice(0, options.length)
    }
  }, [open, options.length])

  useEffect(() => {
    if (!open || position.left === undefined || !focusOnOpenRef.current) return
    const enabledOptions = options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option.disabled)
    const selectedIndex = enabledOptions.find(({ option }) => selectedOptions.includes(option))?.index
    const target = focusLastRef.current
      ? enabledOptions.at(-1)?.index
      : selectedIndex ?? enabledOptions[0]?.index
    focusOnOpenRef.current = false
    if (target !== undefined) optionRefs.current[target]?.focus()
  }, [open, position, options, selectedOptions])

  const isSelected = (candidate: T) =>
    multiSelection
      ? currentValues.some((selected) => valuesEqual(selected, candidate))
      : currentValue !== null && currentValue !== undefined && valuesEqual(currentValue, candidate)

  const classes = [
    'select',
    fullWidth && 'select--full-width',
    disabled && 'select--disabled',
    readOnly && 'select--readonly',
    open && 'select--open',
    className,
  ].filter(Boolean).join(' ')

  const menu = open && typeof document !== 'undefined'
    ? createPortal(
      <div
        className={`select__menu${listClass ? ` ${listClass}` : ''}${fitContent ? ' select__menu--fit-content' : ''}`}
        id={`${selectId}-listbox`}
        ref={menuRef}
        role="listbox"
        aria-labelledby={label ? labelId : undefined}
        aria-multiselectable={multiSelection || undefined}
        style={{ ...position, maxHeight, visibility: position.left === undefined ? 'hidden' : 'visible' }}
      >
        {options.map((option, index) => (
            <button
              key={option.key}
              ref={(element) => { optionRefs.current[index] = element }}
              type="button"
              role="option"
              aria-selected={isSelected(option.value)}
              disabled={option.disabled || disabled}
              tabIndex={-1}
              className={`select__option${isSelected(option.value) ? ' select__option--selected' : ''}${option.disabled ? ' select__option--disabled' : ''}${dense ? ' select__option--dense' : ''}`}
              onClick={() => selectValue(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              <span className="select__option-label">{option.children}</span>
              <span className="select__option-check" aria-hidden="true">
                {isSelected(option.value) ? iconContent(checkedIcon) : ''}
              </span>
            </button>
        ))}
      </div>,
      document.body,
    )
    : null

  return (
    <div ref={rootRef} className={classes}>
      <Field
        id={selectId}
        label={label}
        shrinkLabel={open}
        variant={variant}
        margin={margin}
        adornment={adornment}
        adornmentIcon={adornmentIcon}
        adornmentText={adornmentText}
        adornmentColor={adornmentColor}
        adornmentAriaLabel={adornmentAriaLabel}
        iconSize={iconSize}
        helperText={helperText}
        disabled={disabled}
        error={error}
        errorText={errorText}
        fullWidth={fullWidth}
        onAdornmentClick={onAdornmentClick}
        className="select__field"
      >
        <div className="select__control">
          <button
            ref={triggerRef}
            className={`select__trigger${inputClass ? ` ${inputClass}` : ''}`}
            type="button"
            role="combobox"
            value={typeof displayText === 'string' || typeof displayText === 'number' ? String(displayText) : hasSelection ? 'selected' : ''}
            aria-label={label}
            aria-labelledby={label ? labelId : undefined}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${selectId}-listbox`}
            aria-readonly={readOnly || undefined}
            aria-invalid={error || undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={() => open ? closeMenu() : openMenu()}
            onKeyDown={handleTriggerKeyDown}
          >
            <span className={`select__value${hasSelection ? '' : ' select__value--empty'}`}>
              {hasSelection ? displayText : '\u00a0'}
            </span>
            {multiSelection && hasSelection && selectedOptions.length < options.filter((option) => !option.disabled).length && (
              <span className="select__partial" aria-hidden="true">{iconContent(indeterminateIcon)}</span>
            )}
            <span className="select__expand" aria-hidden="true">{iconContent('ExpandMore')}</span>
          </button>
          {clearable && hasSelection && !disabled && !readOnly && (
            <button
              className="select__clear"
              type="button"
              aria-label="Clear selection"
              onClick={clearValue}
            >
              {iconContent(closeIcon)}
            </button>
          )}
        </div>
      </Field>
      {name && multiSelection
        ? currentValues.map((selectedValue, index) => (
          <input
            key={`${name}-${index}`}
            type="hidden"
            name={name}
            value={String(selectedValue)}
            disabled={disabled}
          />
        ))
        : name && currentValue !== null && currentValue !== undefined
          ? <input type="hidden" name={name} value={String(currentValue)} disabled={disabled} />
          : null}
      {menu}
    </div>
  )
}
