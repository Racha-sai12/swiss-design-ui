import type { ReactNode } from 'react'

export type GridSort = {
  columnKey: string
  direction: 'asc' | 'desc'
}

export type GridState = {
  page: number
  pageSize: number
  sorts: readonly GridSort[]
  filters: Readonly<Record<string, string>>
  groupBy?: string
}

export type GridStateVirtualize = GridState & {
  startIndex: number
  count: number
}

export type GridData<T> = {
  items: readonly T[]
  totalItems: number
}

export type DataGridColumn<T> = {
  key: string
  title: string
  value: (item: T) => unknown
  render?: (item: T) => ReactNode
  editor?: (
    value: unknown,
    onChange: (value: unknown) => void,
    item: T,
  ) => ReactNode
  update?: (item: T, value: unknown) => T
  sortable?: boolean
  filterable?: boolean
  groupable?: boolean
  hideable?: boolean
  resizable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  footer?: ReactNode
}

export type GridEntry<T> = {
  item: T
  index: number
}

export type GridEditing<T> = {
  id: string
  item: T
  draft: T
  columnKey?: string
}
