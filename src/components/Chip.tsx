import {
  createContext,
  isValidElement,
  useContext,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import type { ChipColor, ChipSize, ChipVariant } from '../styles/types.js'

export type ChipSelectionMode = 'SingleSelection' | 'MultiSelection' | 'ToggleSelection'
export type { ChipSize, ChipVariant, ChipColor } from '../styles/types.js'
export type ChipValue = unknown
export type ChipComparer = (left: ChipValue, right: ChipValue) => boolean

type ChipSetContextValue = {
  selectionMode: ChipSelectionMode
  selectedValues: ChipValue[]
  comparer: ChipComparer
  disabled: boolean
  readOnly: boolean
  isRemoved: (value: ChipValue | undefined) => boolean
  defaults: {
    color: ChipColor
    selectedColor?: ChipColor
    iconColor?: string
    size: ChipSize
    label: boolean
    ripple: boolean
    checkedIcon: ReactNode
    closeIcon: ReactNode
    allClosable: boolean
  }
  selectValue: (value: ChipValue) => boolean
  closeChip: (value: ChipValue | undefined, callback?: () => void) => void
}

const ChipSetContext = createContext<ChipSetContextValue | undefined>(undefined)

type ChipContextDefaults = Partial<ChipSetContextValue['defaults']>

function useChipSetContext() {
  return useContext(ChipSetContext)
}

function sameValue(comparer: ChipComparer, left: ChipValue, right: ChipValue) {
  return comparer(left, right)
}

export type ChipProps = {
  color?: ChipColor
  selectedColor?: ChipColor
  iconColor?: string
  variant?: ChipVariant
  size?: ChipSize
  label?: boolean
  ripple?: boolean
  text?: string
  children?: ReactNode
  avatarContent?: ReactNode
  icon?: ReactNode
  checkedIcon?: ReactNode
  closeIcon?: ReactNode
  selected?: boolean
  defaultSelected?: boolean
  disabled?: boolean
  value?: ChipValue
  href?: string
  target?: '_self' | '_blank'
  forceLoad?: boolean
  ariaLabel?: string
  onClick?: (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
  onClose?: () => void
  onSelectedChanged?: (selected: boolean) => void
}

function renderIcon(icon: ReactNode) {
  if (typeof icon !== 'string') {
    return icon
  }

  const icons: Record<string, string> = {
    Check: '✓',
    Close: '×',
    Add: '+',
    Info: 'i',
    Star: '★',
  }

  return icons[icon] ?? icon
}

function Chip({
  color,
  selectedColor,
  iconColor,
  variant = 'Outlined',
  size,
  label,
  ripple,
  text,
  children,
  avatarContent,
  icon,
  checkedIcon,
  closeIcon,
  selected: selectedProp,
  defaultSelected = false,
  disabled = false,
  value,
  href,
  target = '_self',
  forceLoad = false,
  ariaLabel,
  onClick,
  onClose,
  onSelectedChanged,
}: ChipProps) {
  const context = useChipSetContext()
  const [standaloneSelected, setStandaloneSelected] = useState(defaultSelected)
  const isControlled = selectedProp !== undefined
  const selectedInSet = context?.selectedValues.some((selectedValue) =>
    value !== undefined && sameValue(context.comparer, selectedValue, value),
  ) ?? false
  const selected = isControlled
    ? selectedProp
    : context
      ? selectedInSet
      : standaloneSelected
  const resolvedColor = color ?? context?.defaults.color ?? 'Default'
  const resolvedSelectedColor = selectedColor
    ?? context?.defaults.selectedColor
    ?? color
    ?? context?.defaults.color
    ?? 'Primary'
  const resolvedIconColor = iconColor ?? context?.defaults.iconColor
  const resolvedSize = size ?? context?.defaults.size ?? 'Medium'
  const resolvedLabel = label ?? context?.defaults.label ?? true
  const resolvedRipple = ripple ?? context?.defaults.ripple ?? false
  const resolvedCheckedIcon = checkedIcon ?? context?.defaults.checkedIcon ?? 'Check'
  const closable = onClose !== undefined || context?.defaults.allClosable === true
  const resolvedCloseIcon = closeIcon ?? context?.defaults.closeIcon ?? 'Close'
  const content = children ?? text
  const isLink = href !== undefined
  const isDisabled = disabled || context?.disabled === true || context?.readOnly === true
  const isRemoved = context?.isRemoved(value) ?? false
  const classNames = [
    'custom-chip',
    `custom-chip--${variant.toLowerCase()}`,
    `custom-chip--${resolvedSize.toLowerCase()}`,
    `custom-chip--color-${resolvedColor.toLowerCase()}`,
    `custom-chip--selected-color-${resolvedSelectedColor.toLowerCase()}`,
    selected && 'custom-chip--selected',
    resolvedLabel && 'custom-chip--label',
    resolvedRipple && 'custom-chip--ripple',
    isDisabled && 'custom-chip--disabled',
  ]
    .filter(Boolean)
    .join(' ')
  const chipStyle: (CSSProperties & { '--chip-icon-color'?: string }) | undefined = resolvedIconColor
    ? { '--chip-icon-color': resolvedIconColor }
    : undefined

  const changeSelected = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (isDisabled) {
      return
    }

    onClick?.(event)

    if (context?.readOnly) {
      return
    }

    let nextSelected = !selected
    if (context && value !== undefined) {
      nextSelected = context.selectValue(value)
    } else if (context === undefined && !isControlled) {
      setStandaloneSelected((current) => !current)
    }

    if (context === undefined || value !== undefined) {
      onSelectedChanged?.(nextSelected)
    }
  }

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    context?.closeChip(value, onClose)
    if (!context) {
      if (!isControlled) {
        setStandaloneSelected(false)
      }
      onClose?.()
      onSelectedChanged?.(false)
    }
  }

  const chipContent = (
    <>
      {avatarContent != null && (
        <span className="custom-chip__avatar">{avatarContent}</span>
      )}
      {selected && renderIcon(resolvedCheckedIcon) != null ? (
        <span className="custom-chip__icon" aria-hidden="true">{renderIcon(resolvedCheckedIcon)}</span>
      ) : icon != null ? (
        <span className="custom-chip__icon" aria-hidden="true">{renderIcon(icon)}</span>
      ) : null}
      <span className="custom-chip__text">{content}</span>
    </>
  )

  if (isRemoved) {
    return null
  }

  return (
    <span className="custom-chip-wrap" style={chipStyle}>
      {isLink ? (
        <a
          className={classNames}
          href={isDisabled ? undefined : href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          aria-disabled={isDisabled || undefined}
          aria-current={selected ? 'true' : undefined}
          aria-label={ariaLabel ?? (typeof content === 'string' ? content : undefined)}
          onClick={(event) => {
            if (isDisabled) {
              event.preventDefault()
              return
            }
            onClick?.(event)
            if (context && value !== undefined && !context.readOnly) {
              onSelectedChanged?.(context.selectValue(value))
            }
            if (forceLoad && !event.defaultPrevented) {
              event.preventDefault()
              window.location.assign(href)
            }
          }}
        >
          {chipContent}
        </a>
      ) : (
        <button
          className={classNames}
          type="button"
          disabled={isDisabled}
          aria-pressed={selected}
          aria-label={ariaLabel ?? (typeof content === 'string' ? content : undefined)}
          onClick={changeSelected}
        >
          {chipContent}
        </button>
      )}
      {closable && (
        <button
          className="custom-chip__close"
          type="button"
          disabled={isDisabled}
          aria-label={`Remove ${typeof content === 'string' ? content : 'chip'}`}
          onClick={handleClose}
        >
          <span aria-hidden="true">{renderIcon(resolvedCloseIcon)}</span>
        </button>
      )}
    </span>
  )
}

export type ChipSetProps = ChipContextDefaults & {
  selectionMode?: ChipSelectionMode
  selectedValue?: ChipValue
  selectedValues?: readonly ChipValue[]
  comparer?: ChipComparer
  disabled?: boolean
  readOnly?: boolean
  onClose?: (value: ChipValue | undefined) => void
  onSelectedValueChanged?: (value: ChipValue | undefined) => void
  onSelectedValuesChanged?: (values: readonly ChipValue[]) => void
  children: ReactNode
}

export function ChipSet({
  selectionMode = 'SingleSelection',
  selectedValue,
  selectedValues,
  comparer = Object.is,
  color = 'Default',
  selectedColor,
  iconColor,
  size = 'Medium',
  label = true,
  ripple = false,
  checkedIcon = 'Check',
  closeIcon = 'Close',
  allClosable = false,
  disabled = false,
  readOnly = false,
  onClose,
  onSelectedValueChanged,
  onSelectedValuesChanged,
  children,
}: ChipSetProps) {
  const chips = Array.isArray(children) ? children : [children]
  const defaultValues = chips.flatMap((child) => {
    if (!isValidElement<ChipProps>(child) || !child.props.defaultSelected) {
      return []
    }
    return child.props.value === undefined ? [] : [child.props.value]
  })
  const [internalValues, setInternalValues] = useState<ChipValue[]>(() => {
    if (selectionMode === 'MultiSelection') {
      return defaultValues
    }
    return defaultValues.slice(0, 1)
  })
  const [removedValues, setRemovedValues] = useState<ChipValue[]>([])
  const isMultiControlled = selectedValues !== undefined
  const isSingleControlled = selectedValue !== undefined
  const currentValues: ChipValue[] = selectionMode === 'MultiSelection'
    ? [...(selectedValues ?? internalValues)]
    : selectedValue !== undefined
      ? [selectedValue]
      : internalValues.slice(0, 1)

  const selectValue = (value: ChipValue) => {
    const isCurrentlySelected = currentValues.some((current) =>
      sameValue(comparer, current, value),
    )
    const nextValues = selectionMode === 'MultiSelection'
      ? isCurrentlySelected
        ? currentValues.filter((current) => !sameValue(comparer, current, value))
        : [...currentValues, value]
      : selectionMode === 'ToggleSelection' && isCurrentlySelected
        ? []
        : [value]

    if (selectionMode === 'MultiSelection') {
      if (!isMultiControlled) {
        setInternalValues(nextValues)
      }
      onSelectedValuesChanged?.(nextValues)
    } else {
      if (!isSingleControlled) {
        setInternalValues(nextValues)
      }
      onSelectedValueChanged?.(nextValues[0])
    }

    return nextValues.some((current) => sameValue(comparer, current, value))
  }

  const closeChip = (value: ChipValue | undefined, callback?: () => void) => {
    callback?.()
    onClose?.(value)

    if (value === undefined) {
      return
    }

    setRemovedValues((current) =>
      current.some((removed) => sameValue(comparer, removed, value))
        ? current
        : [...current, value],
    )
    const nextValues = currentValues.filter((current) => !sameValue(comparer, current, value))
    if (selectionMode === 'MultiSelection' && !isMultiControlled) {
      setInternalValues(nextValues)
    }
    if (nextValues.length !== currentValues.length) {
      if (selectionMode === 'MultiSelection') {
        onSelectedValuesChanged?.(nextValues)
      } else {
        if (!isSingleControlled) {
          setInternalValues([])
        }
        onSelectedValueChanged?.(undefined)
      }
    }
  }

  return (
    <ChipSetContext.Provider
      value={{
        selectionMode,
        selectedValues: currentValues,
        comparer,
        disabled,
        readOnly,
        isRemoved: (value) => value !== undefined &&
          removedValues.some((removed) => sameValue(comparer, removed, value)),
        defaults: {
          color,
          selectedColor,
          iconColor,
          size,
          label,
          ripple,
          checkedIcon,
          closeIcon,
          allClosable,
        },
        selectValue,
        closeChip,
      }}
    >
      <div
        className="custom-chip-set"
        role={selectionMode === 'MultiSelection' ? 'group' : 'group'}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
      >
        {children}
      </div>
    </ChipSetContext.Provider>
  )
}

const ChipWithSet = Object.assign(Chip, { Set: ChipSet })

export default ChipWithSet
