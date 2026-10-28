import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import type { DatePickerVariant } from '../styles/types.js'
import Field, {
  type FieldAdornment,
  type FieldAdornmentColor,
  type FieldIconSize,
  type FieldMargin,
  type FieldVariant,
} from './Field.js'

export type { DatePickerVariant } from '../styles/types.js'
export type DatePickerView = 'Date' | 'Month' | 'Year'
export type DateInputMask = string | ((value: string) => string)

export type DatePickerProps = {
  date?: Date | null
  defaultDate?: Date | null
  dateChanged?: (date: Date | null) => void
  minDate?: Date | null
  maxDate?: Date | null
  isDateDisabledFunc?: (date: Date) => boolean
  fixYear?: number
  fixMonth?: number
  fixDay?: number
  pickerVariant?: DatePickerVariant
  openTo?: DatePickerView
  editable?: boolean
  autoClose?: boolean
  disableToolbar?: boolean
  dateFormat?: string
  culture?: string
  mask?: DateInputMask
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
  style?: CSSProperties
  pickerOpened?: () => void
  pickerClosed?: () => void
  onAdornmentClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

type CalendarDay = {
  date: Date
  inMonth: boolean
}

const FORMAT_TOKEN = /yyyy|yy|MMMM|MMM|MM|M|dd|d/g

function isValidDate(date: Date | null | undefined): date is Date {
  return date instanceof Date && Number.isFinite(date.getTime())
}

function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatDate(date: Date | null, format: string, locale: string) {
  if (!date) return ''
  const monthLong = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
  const monthShort = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
  const replacements: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    yy: String(date.getFullYear()).slice(-2),
    MMMM: monthLong,
    MMM: monthShort,
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    M: String(date.getMonth() + 1),
    dd: String(date.getDate()).padStart(2, '0'),
    d: String(date.getDate()),
  }
  return format.replace(FORMAT_TOKEN, (token) => replacements[token])
}

function parseDate(value: string, format: string, locale: string): Date | null {
  const tokens: string[] = []
  const expression = format
    .split(new RegExp(`(${FORMAT_TOKEN.source})`, 'g'))
    .map((part) => {
      if (FORMAT_TOKEN.test(part)) {
        FORMAT_TOKEN.lastIndex = 0
        tokens.push(part)
        return part === 'MMMM' || part === 'MMM' ? '([\\p{L}.]+)' : '(\\d{1,4})'
      }
      FORMAT_TOKEN.lastIndex = 0
      return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('')
  const match = new RegExp(`^${expression}$`, 'iu').exec(value.trim())
  if (!match) return null

  const parts: Record<string, string> = {}
  tokens.forEach((token, index) => {
    parts[token] = match[index + 1]
  })

  let year = Number(parts.yyyy ?? parts.yy)
  const shortYear = parts.yyyy === undefined
  if (shortYear && year < 100) year += year >= 50 ? 1900 : 2000
  let month = Number(parts.MM ?? parts.M) - 1
  if (parts.MMMM || parts.MMM) {
    const text = (parts.MMMM ?? parts.MMM).toLocaleLowerCase(locale).replace(/\.$/, '')
    month = Array.from({ length: 12 }).findIndex((_, candidateMonth) => {
      const monthDate = new Date(2020, candidateMonth, 1)
      const monthStyles: Array<'long' | 'short'> = ['long', 'short']
      return monthStyles.some((style) =>
        new Intl.DateTimeFormat(locale, { month: style }).format(monthDate)
          .toLocaleLowerCase(locale)
          .replace(/\.$/, '') === text,
      )
    })
  }
  const day = Number(parts.dd ?? parts.d)
  if (![year, month, day].every(Number.isFinite) || month < 0 || month > 11 || day < 1) return null
  const result = new Date(year, month, day)
  return result.getFullYear() === year && result.getMonth() === month && result.getDate() === day
    ? result
    : null
}

function getWeekdayNames(locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(new Date(Date.UTC(2023, 0, 1 + index))),
  )
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1).getDay()
  const start = new Date(year, month, 1 - firstDay)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    return { date, inMonth: date.getMonth() === month }
  })
}

function clampCalendarDate(date: Date, minDate?: Date | null, maxDate?: Date | null) {
  let result = dateOnly(date)
  if (isValidDate(minDate) && result < dateOnly(minDate)) result = dateOnly(minDate)
  if (isValidDate(maxDate) && result > dateOnly(maxDate)) result = dateOnly(maxDate)
  return result
}

function iconContent(icon: string) {
  const icons: Record<string, string> = {
    Calendar: '▦',
    ArrowLeft: '←',
    ArrowRight: '→',
    ExpandMore: '⌄',
    Close: '×',
  }
  return icons[icon] ?? icon
}

export default function DatePicker({
  date,
  defaultDate = null,
  dateChanged,
  minDate,
  maxDate,
  isDateDisabledFunc = () => false,
  fixYear,
  fixMonth,
  fixDay,
  pickerVariant = 'Inline',
  openTo = 'Date',
  editable = false,
  autoClose = true,
  disableToolbar = false,
  dateFormat = 'MM/dd/yyyy',
  culture = typeof navigator === 'undefined' ? 'en-US' : navigator.language,
  mask,
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
  style,
  pickerOpened,
  pickerClosed,
  onAdornmentClick,
}: DatePickerProps) {
  const generatedId = useId()
  const pickerId = id ?? generatedId
  const labelId = `${pickerId}-label`
  const calendarId = `${pickerId}-calendar`
  const [today] = useState(() => dateOnly(new Date()))
  const isControlled = date !== undefined
  const [uncontrolledDate, setUncontrolledDate] = useState<Date | null>(
    () => isValidDate(defaultDate) ? dateOnly(defaultDate) : null,
  )
  const selectedDateValue = isControlled ? date : uncontrolledDate
  const selectedDate = isValidDate(selectedDateValue) ? dateOnly(selectedDateValue) : null
  const safeMinDate = isValidDate(minDate) ? dateOnly(minDate) : null
  const safeMaxDate = isValidDate(maxDate) ? dateOnly(maxDate) : null
  const initialDate = selectedDate ?? clampCalendarDate(today, safeMinDate, safeMaxDate)
  const fixedAnchor = new Date(
    fixYear ?? initialDate.getFullYear(),
    fixMonth !== undefined ? fixMonth - 1 : initialDate.getMonth(),
    fixDay ?? initialDate.getDate(),
  )
  const visibleAnchor = Number.isFinite(fixedAnchor.getTime())
    ? clampCalendarDate(fixedAnchor, safeMinDate, safeMaxDate)
    : initialDate
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(visibleAnchor.getFullYear(), visibleAnchor.getMonth(), 1))
  const [view, setView] = useState<DatePickerView>(openTo)
  const [open, setOpen] = useState(false)
  const dateSourceKey = `${selectedDate?.getTime() ?? ''}|${dateFormat}|${culture}`
  const [draftState, setDraftState] = useState(() => ({
    key: dateSourceKey,
    value: formatDate(selectedDate, dateFormat, culture),
  }))
  const draft = draftState.key === dateSourceKey
    ? draftState.value
    : formatDate(selectedDate, dateFormat, culture)
  const isOpen = pickerVariant === 'Static' || open
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const closePicker = useCallback(() => {
    if (pickerVariant === 'Static' || !open) return
    setOpen(false)
    pickerClosed?.()
  }, [pickerVariant, open, pickerClosed])

  useEffect(() => {
    if (!isOpen || pickerVariant === 'Static') return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !calendarRef.current?.contains(target)) {
        closePicker()
      }
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        pickerClosed?.()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, pickerVariant, pickerClosed, closePicker])

  const displayMonth = new Intl.DateTimeFormat(culture, { month: 'long', year: 'numeric' })
    .format(visibleMonth)
  const monthNames = useMemo(() => Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(culture, { month: 'long' }).format(new Date(2020, month, 1)),
  ), [culture])
  const weekdayNames = useMemo(() => getWeekdayNames(culture), [culture])
  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth],
  )

  const isDateDisabled = (candidate: Date) => {
    const current = dateOnly(candidate)
    if (safeMinDate && current < safeMinDate) return true
    if (safeMaxDate && current > safeMaxDate) return true
    if (fixYear !== undefined && current.getFullYear() !== fixYear) return true
    if (fixMonth !== undefined && current.getMonth() !== fixMonth - 1) return true
    if (fixDay !== undefined && current.getDate() !== fixDay) return true
    return isDateDisabledFunc(current)
  }

  const openPicker = () => {
    if (disabled || pickerVariant === 'Static' || isOpen) return
    const baseAnchor = selectedDate ?? clampCalendarDate(today, safeMinDate, safeMaxDate)
    const fixedDate = new Date(
      fixYear ?? baseAnchor.getFullYear(),
      fixMonth !== undefined ? fixMonth - 1 : baseAnchor.getMonth(),
      fixDay ?? baseAnchor.getDate(),
    )
    const anchor = Number.isFinite(fixedDate.getTime())
      ? clampCalendarDate(fixedDate, safeMinDate, safeMaxDate)
      : baseAnchor
    setVisibleMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
    setView(openTo)
    setOpen(true)
    pickerOpened?.()
  }

  const selectDate = (nextDate: Date) => {
    const normalized = dateOnly(nextDate)
    if (isDateDisabled(normalized)) return
    if (!isControlled) setUncontrolledDate(normalized)
    setDraftState({ key: dateSourceKey, value: formatDate(normalized, dateFormat, culture) })
    dateChanged?.(normalized)
    if (autoClose) {
      closePicker()
      inputRef.current?.focus()
    }
  }

  const navigateMonth = (amount: number) => {
    const next = view === 'Year'
      ? new Date(visibleMonth.getFullYear() + amount * 10, visibleMonth.getMonth(), 1)
      : view === 'Month'
        ? new Date(visibleMonth.getFullYear() + amount, visibleMonth.getMonth(), 1)
        : new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1)
    if (fixYear !== undefined && next.getFullYear() !== fixYear) return
    if (view === 'Date' && fixMonth !== undefined && next.getMonth() !== fixMonth - 1) return
    if (view === 'Date' && safeMinDate && next.getFullYear() === safeMinDate.getFullYear() &&
        next.getMonth() < safeMinDate.getMonth()) return
    if (view === 'Date' && safeMaxDate && next.getFullYear() === safeMaxDate.getFullYear() &&
        next.getMonth() > safeMaxDate.getMonth()) return
    if (safeMinDate && next < new Date(safeMinDate.getFullYear(), safeMinDate.getMonth(), 1)) return
    if (safeMaxDate && next > new Date(safeMaxDate.getFullYear(), safeMaxDate.getMonth(), 1)) return
    setVisibleMonth(next)
  }

  const isMonthDisabled = (month: number) => {
    const year = visibleMonth.getFullYear()
    if (fixMonth !== undefined && month !== fixMonth - 1) return true
    if (fixYear !== undefined && year !== fixYear) return true
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    if (safeMinDate && monthEnd < safeMinDate) return true
    if (safeMaxDate && monthStart > safeMaxDate) return true
    return !Array.from({ length: monthEnd.getDate() }, (_, day) =>
      new Date(year, month, day + 1),
    ).some((candidate) => !isDateDisabled(candidate))
  }

  const isYearDisabled = (year: number) => {
    if (fixYear !== undefined && year !== fixYear) return true
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    if (safeMinDate && end < safeMinDate) return true
    if (safeMaxDate && start > safeMaxDate) return true
    return !Array.from({ length: 12 }, (_, month) => month)
      .some((month) => !isMonthDisabledForYear(year, month))
  }

  const isMonthDisabledForYear = (year: number, month: number) => {
    if (fixMonth !== undefined && month !== fixMonth - 1) return true
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    if (safeMinDate && monthEnd < safeMinDate) return true
    if (safeMaxDate && monthStart > safeMaxDate) return true
    return !Array.from({ length: monthEnd.getDate() }, (_, day) =>
      new Date(year, month, day + 1),
    ).some((candidate) => !isDateDisabled(candidate))
  }

  const isNavigationDisabled = (amount: number) => {
    if (view === 'Date') {
      const target = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1)
      if (fixYear !== undefined && target.getFullYear() !== fixYear) return true
      if (fixMonth !== undefined && target.getMonth() !== fixMonth - 1) return true
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0)
      if (safeMinDate && lastDay < safeMinDate) return true
      if (safeMaxDate && target > safeMaxDate) return true
      return false
    }

    const targetYear = visibleMonth.getFullYear() + amount * (view === 'Year' ? 10 : 1)
    if (view === 'Month') {
      const targetStart = new Date(targetYear, 0, 1)
      const targetEnd = new Date(targetYear, 11, 31)
      if (fixYear !== undefined && targetYear !== fixYear) return true
      if (safeMinDate && targetEnd < safeMinDate) return true
      if (safeMaxDate && targetStart > safeMaxDate) return true
      return false
    }

    const decadeStart = Math.floor(targetYear / 10) * 10 - 1
    const decadeEnd = decadeStart + 11
    if (fixYear !== undefined && (fixYear < decadeStart || fixYear > decadeEnd)) return true
    if (safeMinDate && decadeEnd < safeMinDate.getFullYear()) return true
    if (safeMaxDate && decadeStart > safeMaxDate.getFullYear()) return true
    return false
  }

  const handleInputChange = (nextValue: string) => {
    const masked = typeof mask === 'function'
      ? mask(nextValue)
      : mask
        ? applyInputMask(nextValue, mask)
        : nextValue
    setDraftState({ key: dateSourceKey, value: masked })
    const parsed = parseDate(masked, dateFormat, culture)
    if (parsed && !isDateDisabled(parsed)) {
      if (!isControlled) setUncontrolledDate(parsed)
      dateChanged?.(parsed)
    }
  }

  const handleInputBlur = () => {
    const parsed = parseDate(draft, dateFormat, culture)
    if (!parsed || isDateDisabled(parsed)) {
      setDraftState({
        key: dateSourceKey,
        value: formatDate(selectedDate, dateFormat, culture),
      })
      return
    }
    setDraftState({ key: dateSourceKey, value: formatDate(parsed, dateFormat, culture) })
  }

  const handleCalendarKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (pickerVariant === 'Dialog' && event.key === 'Tab') {
      const focusable = calendarRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled)',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }
    if (view !== 'Date') return
    const activeIndex = dayButtonRefs.current.findIndex((button) => button === document.activeElement)
    if (activeIndex < 0) return
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }
    if (event.key === 'Home') {
      event.preventDefault()
      const rowStart = Math.floor(activeIndex / 7) * 7
      focusAvailableDay(rowStart, 1)
    } else if (event.key === 'End') {
      event.preventDefault()
      const rowEnd = Math.floor(activeIndex / 7) * 7 + 6
      focusAvailableDay(rowEnd, -1)
    } else if (offsets[event.key] !== undefined) {
      event.preventDefault()
      focusAvailableDay(activeIndex + offsets[event.key], Math.sign(offsets[event.key]))
    }
  }

  const focusAvailableDay = (startIndex: number, direction: number) => {
    for (let index = startIndex; index >= 0 && index < calendarDays.length; index += direction) {
      const button = dayButtonRefs.current[index]
      if (button && !button.disabled) {
        button.focus()
        const target = calendarDays[index].date
        if (target.getMonth() !== visibleMonth.getMonth() ||
            target.getFullYear() !== visibleMonth.getFullYear()) {
          setVisibleMonth(new Date(target.getFullYear(), target.getMonth(), 1))
        }
        return
      }
    }
  }

  const calendar = (
    <div
      ref={calendarRef}
      id={calendarId}
      className={`date-picker__calendar${pickerVariant === 'Static' ? ' date-picker__calendar--static' : ''}`}
      role="dialog"
      aria-modal={pickerVariant === 'Dialog' || undefined}
      aria-label={label ? `${label} calendar` : 'Date picker calendar'}
      onKeyDown={handleCalendarKeyDown}
    >
      {!disableToolbar && (
        <div className="date-picker__toolbar">
          <div className="date-picker__toolbar-selection">
            <button type="button" className="date-picker__toolbar-date" onClick={() => setView('Date')}>
              {selectedDate ? formatDate(selectedDate, 'MMM d, yyyy', culture) : 'Select date'}
            </button>
          </div>
          {pickerVariant !== 'Static' && (
            <button type="button" className="date-picker__toolbar-close" aria-label="Close calendar" onClick={closePicker}>
              {iconContent('Close')}
            </button>
          )}
        </div>
      )}
      <div className="date-picker__navigation">
        <button
          type="button"
          className="date-picker__nav-button"
          aria-label={view === 'Year' ? 'Previous decade' : view === 'Month' ? 'Previous year' : 'Previous month'}
          onClick={() => navigateMonth(-1)}
          disabled={isNavigationDisabled(-1)}
        >
          {iconContent('ArrowLeft')}
        </button>
        <div className="date-picker__navigation-title">
          <button type="button" onClick={() => setView(view === 'Month' ? 'Date' : 'Month')}>
            {new Intl.DateTimeFormat(culture, { month: 'long' }).format(visibleMonth)}
          </button>
          <button type="button" onClick={() => setView(view === 'Year' ? 'Date' : 'Year')}>
            {visibleMonth.getFullYear()}
          </button>
        </div>
        <button
          type="button"
          className="date-picker__nav-button"
          aria-label={view === 'Year' ? 'Next decade' : view === 'Month' ? 'Next year' : 'Next month'}
          onClick={() => navigateMonth(1)}
          disabled={isNavigationDisabled(1)}
        >
          {iconContent('ArrowRight')}
        </button>
      </div>

      {view === 'Date' && (
        <div className="date-picker__day-view" role="grid" aria-label={displayMonth}>
          <div className="date-picker__weekdays" role="row">
            {weekdayNames.map((weekday, index) => (
              <span key={`${weekday}-${index}`} role="columnheader">{weekday}</span>
            ))}
          </div>
          <div className="date-picker__days">
            {Array.from({ length: 6 }, (_, weekIndex) => (
              <div key={weekIndex} className="date-picker__week" role="row">
                {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ date: day, inMonth }, dayIndex) => {
                  const index = weekIndex * 7 + dayIndex
                  const isSelected = selectedDate !== null && day.getTime() === selectedDate.getTime()
                  const isToday = today.getTime() === day.getTime()
                  const accessibleDate = new Intl.DateTimeFormat(culture, { dateStyle: 'full' }).format(day)
                  return (
                    <div
                      key={day.toISOString()}
                      className="date-picker__cell"
                      role="gridcell"
                      aria-label={accessibleDate}
                      aria-selected={isSelected}
                    >
                      <button
                        ref={(element) => { dayButtonRefs.current[index] = element }}
                        type="button"
                        aria-label={accessibleDate}
                        aria-current={isToday ? 'date' : undefined}
                        disabled={isDateDisabled(day)}
                        tabIndex={isSelected || (!selectedDate && isToday) ? 0 : -1}
                        className={[
                          'date-picker__day',
                          !inMonth && 'date-picker__day--outside',
                          isSelected && 'date-picker__day--selected',
                          isToday && 'date-picker__day--today',
                        ].filter(Boolean).join(' ')}
                        onClick={() => selectDate(day)}
                      >
                        {new Intl.NumberFormat(culture).format(day.getDate())}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'Month' && (
        <div className="date-picker__month-grid">
          {monthNames.map((month, index) => (
            <button
              key={month}
              type="button"
              disabled={isMonthDisabled(index)}
              className={index === visibleMonth.getMonth() ? 'date-picker__choice--selected' : undefined}
              onClick={() => {
                setVisibleMonth(new Date(visibleMonth.getFullYear(), index, 1))
                setView('Date')
              }}
            >
              {new Intl.DateTimeFormat(culture, { month: 'short' }).format(new Date(2020, index, 1))}
            </button>
          ))}
        </div>
      )}

      {view === 'Year' && (
        <div className="date-picker__year-grid">
          {Array.from(
            { length: 12 },
            (_, index) => Math.floor(visibleMonth.getFullYear() / 10) * 10 - 1 + index,
          ).map((year) => (
            <button
              key={year}
              type="button"
              disabled={isYearDisabled(year)}
              className={year === visibleMonth.getFullYear() ? 'date-picker__choice--selected' : undefined}
              onClick={() => {
                setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1))
                setView('Month')
              }}
            >
              {new Intl.NumberFormat(culture).format(year)}
            </button>
          ))}
        </div>
      )}
      {pickerVariant !== 'Static' && (
        <div className="date-picker__actions">
          <button type="button" onClick={() => selectDate(today)} disabled={isDateDisabled(today)}>
            Today
          </button>
          <button type="button" onClick={closePicker}>Cancel</button>
        </div>
      )}
    </div>
  )

  useEffect(() => {
    if (!isOpen || pickerVariant !== 'Dialog') return
    const activeDay = calendarRef.current?.querySelector<HTMLButtonElement>(
      '.date-picker__day--selected:not(:disabled), .date-picker__day:not(:disabled)',
    )
    activeDay?.focus()
  }, [isOpen, pickerVariant])

  const classes = [
    'date-picker',
    fullWidth && 'date-picker--full-width',
    pickerVariant === 'Static' && 'date-picker--static',
    isOpen && 'date-picker--open',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div ref={rootRef} className={classes} style={style}>
      <Field
        id={pickerId}
        label={label}
        shrinkLabel={isOpen || Boolean(draft)}
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
        className="date-picker__field"
        onAdornmentClick={onAdornmentClick}
      >
        <div className="date-picker__input-wrap">
          <input
            ref={inputRef}
            className="date-picker__input"
            type="text"
            inputMode={editable ? 'numeric' : undefined}
            value={draft}
            placeholder={editable ? dateFormat : undefined}
            readOnly={!editable || readOnly}
            disabled={disabled}
            name={name}
            aria-label={label}
            aria-labelledby={label ? labelId : undefined}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={calendarId}
            aria-invalid={error || undefined}
            onChange={(event) => handleInputChange(event.target.value)}
            onBlur={handleInputBlur}
            onClick={openPicker}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                openPicker()
              } else if (event.key === 'Escape') {
                event.stopPropagation()
                closePicker()
              }
            }}
          />
          <button
            type="button"
            className="date-picker__toggle"
            aria-label={isOpen ? 'Close calendar' : 'Open calendar'}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            disabled={disabled || pickerVariant === 'Static'}
            onClick={() => isOpen ? closePicker() : openPicker()}
          >
            {iconContent('Calendar')}
          </button>
        </div>
      </Field>
      {pickerVariant === 'Static' && calendar}
      {pickerVariant === 'Inline' && isOpen && calendar}
      {pickerVariant === 'Dialog' && isOpen && typeof document !== 'undefined' && createPortal(
        <div className="date-picker__backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePicker()
        }}>
          {calendar}
        </div>,
        document.body,
      )}
    </div>
  )
}

function applyInputMask(value: string, mask: string) {
  const digits = value.replace(/\D/g, '')
  let digitIndex = 0
  return [...mask].map((character) => {
    if (character.toLowerCase() === 'd' || character.toLowerCase() === 'm' || character.toLowerCase() === 'y') {
      return digits[digitIndex++] ?? ''
    }
    return digitIndex < digits.length ? character : ''
  }).join('')
}
