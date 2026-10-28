import type { ReactNode } from 'react'
import { CircleCheck, CircleX, Info, Minus, TriangleAlert, X, LucideIcon } from 'lucide-react'
import type { AlertVariant, ContentAlignment } from '../styles/types.js'

export type AlertSeverity = 'Info' | 'Success' | 'Warning' | 'Error' | 'Normal'

export type AlertProps = {
  severity?: AlertSeverity
  variant?: AlertVariant
  dense?: boolean
  square?: boolean
  contentAlignment?: ContentAlignment
  showCloseIcon?: boolean
  onCloseIconClicked?: () => void
  children: ReactNode
}

const severityIcons = {
  Info,
  Success: CircleCheck,
  Warning: TriangleAlert,
  Error: CircleX,
  Normal: Minus,
} satisfies Record<AlertSeverity, LucideIcon>

export default function Alert({
  severity = 'Normal',
  variant = 'Text',
  dense = false,
  square = true,
  contentAlignment = 'Start',
  showCloseIcon = false,
  onCloseIconClicked,
  children,
}: AlertProps) {
  const SeverityIcon = severityIcons[severity]
  const classNames = [
    'alert',
    `alert--${variant.toLowerCase()}`,
    `alert--align-${contentAlignment.toLowerCase()}`,
    dense && 'alert--dense',
    square && 'alert--square',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classNames}
      data-severity={severity.toLowerCase()}
      role={severity === 'Error' ? 'alert' : 'status'}
      aria-live={severity === 'Error' ? 'assertive' : 'polite'}
    >
      <SeverityIcon className="alert__icon" aria-hidden="true" />
      <div className="alert__body">
        <span className="alert__severity">{severity}</span>
        <div className="alert__message">{children}</div>
      </div>
      {showCloseIcon && (
        <button
          className="alert__close"
          type="button"
          aria-label="Close alert"
          onClick={onCloseIconClicked}
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
