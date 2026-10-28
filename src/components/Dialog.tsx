import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { DialogMaxWidth, DialogPosition } from '../styles/types.js'

export type DialogDefaultFocus = 'Element' | 'Dialog' | 'FirstFocusable'
export type { DialogMaxWidth, DialogPosition } from '../styles/types.js'

export type DialogOptions = {
  backdropClick?: boolean
  closeOnEscapeKey?: boolean
  closeButton?: boolean
  fullScreen?: boolean
  fullWidth?: boolean
  maxWidth?: DialogMaxWidth | null
  noHeader?: boolean
  position?: DialogPosition | null
  backgroundClass?: string
}

export type DialogResult<T = unknown> = {
  canceled: boolean
  data?: T
}

function isDialogResult(value: unknown): value is DialogResult {
  return typeof value === 'object' &&
    value !== null &&
    'canceled' in value &&
    typeof value.canceled === 'boolean'
}

function toDialogResult(value: unknown): DialogResult {
  return isDialogResult(value)
    ? value
    : { canceled: false, data: value }
}

export type DialogReference<T = unknown> = {
  id: string
  result: Promise<DialogResult<T>>
  close: (value?: T | DialogResult<T>) => void
  cancel: () => void
}

export type DialogInstance = {
  close: <T = unknown>(value?: T | DialogResult<T>) => void
  cancel: () => void
  cancelAll: () => void
  setOptionsAsync: (options: DialogOptions) => Promise<void>
  setTitleAsync: (title?: string) => Promise<void>
}

type DialogInstanceContextValue = DialogInstance
const DialogInstanceContext = createContext<DialogInstanceContextValue | undefined>(undefined)

export function useDialogInstance() {
  const instance = useContext(DialogInstanceContext)
  if (instance === undefined) {
    throw new Error('useDialogInstance must be used inside a dialog.')
  }
  return instance
}

export type DialogProps = {
  title?: string
  ariaLabel?: string
  titleContent?: ReactNode
  dialogContent?: ReactNode
  dialogActions?: ReactNode
  children?: ReactNode
  defaultFocus?: DialogDefaultFocus
  gutters?: boolean
  options?: DialogOptions
  actionsClass?: string
  contentClass?: string
  contentStyle?: CSSProperties
  isVisible?: boolean
  onIsVisibleChanged?: (visible: boolean) => void
  onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void
}

type ServiceDialogFrame = {
  id: string
  title?: string
  content: ReactNode
  options: DialogOptions
  onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void
  resolve: (result: DialogResult) => void
}

type DialogServiceValue = {
  showAsync: <P extends object>(
    Component: ComponentType<P>,
    config?: {
      title?: string
      parameters?: P
      options?: DialogOptions
      onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void
      onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
      onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void
    },
  ) => DialogReference
}

const DialogServiceContext = createContext<DialogServiceValue | undefined>(undefined)

export function useDialogService() {
  const service = useContext(DialogServiceContext)
  if (service === undefined) {
    throw new Error('useDialogService must be used inside a DialogProvider.')
  }
  return service
}

const defaultOptions: Required<Pick<
  DialogOptions,
  'backdropClick' | 'closeOnEscapeKey' | 'closeButton' | 'fullScreen' | 'fullWidth' | 'noHeader'
>> = {
  backdropClick: true,
  closeOnEscapeKey: false,
  closeButton: false,
  fullScreen: false,
  fullWidth: false,
  noHeader: false,
}

let openDialogCount = 0
let previousBodyOverflow = ''

function acquireBodyScrollLock() {
  if (openDialogCount === 0) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  openDialogCount += 1

  return () => {
    openDialogCount = Math.max(0, openDialogCount - 1)
    if (openDialogCount === 0) {
      document.body.style.overflow = previousBodyOverflow
    }
  }
}

function DialogSurface({
  title,
  ariaLabel,
  titleContent,
  dialogContent,
  dialogActions,
  children,
  defaultFocus = 'Element',
  gutters = true,
  options,
  actionsClass,
  contentClass,
  contentStyle,
  isVisible = false,
  onIsVisibleChanged,
  onBackdropClick,
  onKeyDown,
  onKeyUp,
  layer = 0,
}: DialogProps & { layer?: number }) {
  const instance = useContext(DialogInstanceContext)
  const headingId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const resolvedOptions = { ...defaultOptions, ...options }
  const visible = isVisible
  const content = dialogContent ?? children

  const requestClose = useCallback(() => {
    if (instance !== undefined) {
      instance.cancel()
    } else {
      onIsVisibleChanged?.(false)
    }
  }, [instance, onIsVisibleChanged])

  useEffect(() => {
    if (!visible) {
      return
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const releaseScrollLock = acquireBodyScrollLock()
    const dialog = dialogRef.current

    if (dialog !== null) {
      const focusTarget = defaultFocus === 'Dialog'
        ? dialog
        : defaultFocus === 'Element'
          ? dialog.querySelector<HTMLElement>('[data-dialog-autofocus]') ??
            dialog.querySelector<HTMLElement>(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ) ??
            dialog
          : dialog.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? dialog
      focusTarget.focus()
    }

    return () => {
      releaseScrollLock()
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus()
      }
    }
  }, [defaultFocus, visible])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }

    if (onBackdropClick !== undefined) {
      onBackdropClick(event)
    } else if (resolvedOptions.backdropClick) {
      requestClose()
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) {
      return
    }

    if (event.key === 'Escape' && resolvedOptions.closeOnEscapeKey) {
      event.preventDefault()
      requestClose()
      return
    }

    if (event.key === 'Tab') {
      const dialog = dialogRef.current
      if (dialog === null) {
        return
      }
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getAttribute('aria-hidden') !== 'true')
      if (focusable.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement
      const activeIndex = activeElement instanceof HTMLElement
        ? focusable.indexOf(activeElement)
        : -1
      if (event.shiftKey && (activeIndex === 0 || activeIndex === -1)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (activeIndex === focusable.length - 1 || activeIndex === -1)) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (!visible) {
    return null
  }

  const position = options?.position ?? 'Center'
  const surfaceClassNames = [
    'custom-dialog-backdrop',
    options?.backgroundClass,
  ].filter(Boolean).join(' ')
  const panelClassNames = [
    'custom-dialog',
    `custom-dialog--position-${position.toLowerCase()}`,
    options?.fullScreen && 'custom-dialog--fullscreen',
    options?.fullWidth && 'custom-dialog--full-width',
    options?.maxWidth && `custom-dialog--max-${options.maxWidth.toLowerCase()}`,
  ].filter(Boolean).join(' ')

  return createPortal(
    <div
      className={surfaceClassNames}
      style={{ zIndex: 1000 + layer }}
      onMouseDown={handleBackdropClick}
      onKeyDown={handleKeyDown}
      onKeyUp={onKeyUp}
    >
      <div
        ref={dialogRef}
        className={panelClassNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby={options?.noHeader || (titleContent == null && title == null) ? undefined : headingId}
        aria-label={options?.noHeader || (titleContent == null && title == null)
          ? ariaLabel ?? (typeof title === 'string' ? title : 'Dialog')
          : undefined}
        tabIndex={-1}
      >
        {!resolvedOptions.noHeader && (
          <header className="custom-dialog__header">
            <div className="custom-dialog__title" id={headingId} role="heading" aria-level={2}>
              {titleContent ?? title}
            </div>
            {resolvedOptions.closeButton && (
              <button
                className="custom-dialog__close"
                type="button"
                aria-label="Close dialog"
                onClick={requestClose}
              >
                ×
              </button>
            )}
          </header>
        )}
        <div
          className={[
            'custom-dialog__content',
            !gutters && 'custom-dialog__content--no-gutters',
            contentClass,
          ].filter(Boolean).join(' ')}
          style={contentStyle}
        >
          {content}
        </div>
        {dialogActions != null && (
          <footer className={['custom-dialog__actions', actionsClass].filter(Boolean).join(' ')}>
            {dialogActions}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  )
}

export function Dialog(props: DialogProps) {
  return <DialogSurface {...props} />
}

export default Dialog

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<ServiceDialogFrame[]>([])
  const nextIdRef = useRef(0)
  const dialogsRef = useRef(dialogs)

  const finishDialog = useCallback((id: string, result: DialogResult) => {
    const dialog = dialogsRef.current.find((entry) => entry.id === id)
    if (dialog === undefined) {
      return
    }
    dialog.resolve(result)
    const remaining = dialogsRef.current.filter((entry) => entry.id !== id)
    dialogsRef.current = remaining
    setDialogs(remaining)
  }, [])

  const cancelAll = useCallback(() => {
    const activeDialogs = dialogsRef.current
    dialogsRef.current = []
    setDialogs([])
    activeDialogs.forEach((dialog) => dialog.resolve({ canceled: true }))
  }, [])

  const showAsync = <P extends object>(
    Component: ComponentType<P>,
    config: {
      title?: string
      parameters?: P
      options?: DialogOptions
      onBackdropClick?: (event: MouseEvent<HTMLDivElement>) => void
      onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
      onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void
    } = {},
  ): DialogReference => {
    const id = `dialog-${++nextIdRef.current}`
    let resolveResult!: (result: DialogResult) => void
    const result = new Promise<DialogResult>((resolve) => {
      resolveResult = resolve
    })
    const frame: ServiceDialogFrame = {
      id,
      title: config.title,
      content: createElement(Component, config.parameters),
      options: config.options ?? {},
      onBackdropClick: config.onBackdropClick,
      onKeyDown: config.onKeyDown,
      onKeyUp: config.onKeyUp,
      resolve: resolveResult,
    }
    const nextDialogs = [...dialogsRef.current, frame]
    dialogsRef.current = nextDialogs
    setDialogs(nextDialogs)

    return {
      id,
      result,
      close: (value) => finishDialog(id, toDialogResult(value)),
      cancel: () => finishDialog(id, { canceled: true }),
    }
  }

  const service = { showAsync }

  return (
    <DialogServiceContext.Provider value={service}>
      {children}
      {dialogs.map((dialog, index) => {
        const instance: DialogInstance = {
          close: (value) => finishDialog(dialog.id, toDialogResult(value)),
          cancel: () => finishDialog(dialog.id, { canceled: true }),
          cancelAll,
          setOptionsAsync: async (nextOptions) => {
            const nextDialogs = dialogsRef.current.map((entry) =>
              entry.id === dialog.id
                ? { ...entry, options: { ...entry.options, ...nextOptions } }
                : entry,
            )
            dialogsRef.current = nextDialogs
            setDialogs(nextDialogs)
          },
          setTitleAsync: async (nextTitle) => {
            const nextDialogs = dialogsRef.current.map((entry) =>
              entry.id === dialog.id ? { ...entry, title: nextTitle } : entry,
            )
            dialogsRef.current = nextDialogs
            setDialogs(nextDialogs)
          },
        }
        return (
          <DialogInstanceContext.Provider key={dialog.id} value={instance}>
            <DialogSurface
              title={dialog.title}
              dialogContent={dialog.content}
              isVisible
              options={dialog.options}
              layer={index}
              onBackdropClick={dialog.onBackdropClick}
              onKeyDown={dialog.onKeyDown}
              onKeyUp={dialog.onKeyUp}
            />
          </DialogInstanceContext.Provider>
        )
      })}
    </DialogServiceContext.Provider>
  )
}
