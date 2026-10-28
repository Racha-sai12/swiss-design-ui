import type { ReactNode } from 'react'
import type { DataGridColumn } from './DataGrid.types.js'

type DataGridToolbarProps<T> = {
  columns: readonly DataGridColumn<T>[]
  toolbarContent?: ReactNode
  filterable: boolean
  filterMode: 'Simple' | 'ColumnFilterMenu' | 'ColumnFilterRow'
  showColumnOptions: boolean
  columnMenuOpen: boolean
  onToggleColumnMenu: () => void
  columnsPanelReordering: boolean
  search: string
  onSearchChange: (value: string) => void
  visibleColumnKeys: readonly string[]
  canHideColumn: (column: DataGridColumn<T>) => boolean
  onToggleColumn: (key: string) => void
  columnOrder: readonly string[]
  onColumnOrderChange: (order: string[]) => void
  canGroupColumns: boolean
  groupable: boolean
  groupBy: string
  onGroupByChange: (key: string) => void
}

export default function DataGridToolbar<T>({
  columns,
  toolbarContent,
  filterable,
  filterMode,
  showColumnOptions,
  columnMenuOpen,
  onToggleColumnMenu,
  columnsPanelReordering,
  search,
  onSearchChange,
  visibleColumnKeys,
  canHideColumn,
  onToggleColumn,
  columnOrder,
  onColumnOrderChange,
  canGroupColumns,
  groupable,
  groupBy,
  onGroupByChange,
}: DataGridToolbarProps<T>) {
  return (
    <>
      {(toolbarContent || filterMode === 'Simple' && filterable || showColumnOptions) && (
        <div className="data-grid__toolbar">
          {toolbarContent}
          {filterable && filterMode === 'Simple' && (
            <label className="data-grid__search">
              <span className="data-grid__sr-only">Search rows</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search rows"
              />
            </label>
          )}
          {showColumnOptions && (
            <div className="data-grid__column-menu">
              <button
                className="data-grid__control"
                type="button"
                aria-expanded={columnMenuOpen}
                onClick={onToggleColumnMenu}
              >
                Columns <span aria-hidden="true">⌄</span>
              </button>
              {columnMenuOpen && (
                <div className="data-grid__column-menu-panel">
                  {columns.map((column) => (
                    <label key={column.key}>
                      <input
                        type="checkbox"
                        checked={visibleColumnKeys.includes(column.key)}
                        disabled={!canHideColumn(column)}
                        onChange={() => onToggleColumn(column.key)}
                      />
                      {column.title}
                      {columnsPanelReordering && (
                        <span className="data-grid__order-controls">
                          <button
                            type="button"
                            aria-label={`Move ${column.title} left`}
                            onClick={() => {
                              const index = columnOrder.indexOf(column.key)
                              if (index > 0) {
                                const next = [...columnOrder]
                                const previous = next[index - 1]
                                next[index - 1] = next[index]
                                next[index] = previous
                                onColumnOrderChange(next)
                              }
                            }}
                          >←</button>
                          <button
                            type="button"
                            aria-label={`Move ${column.title} right`}
                            onClick={() => {
                              const index = columnOrder.indexOf(column.key)
                              if (index < columnOrder.length - 1) {
                                const next = [...columnOrder]
                                const following = next[index + 1]
                                next[index + 1] = next[index]
                                next[index] = following
                                onColumnOrderChange(next)
                              }
                            }}
                          >→</button>
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {canGroupColumns && (
        <label className="data-grid__group-control">
          Group by
          <select
            value={groupBy}
            onChange={(event) => onGroupByChange(event.target.value)}
          >
            <option value="">No grouping</option>
            {columns.filter((column) => column.groupable ?? groupable).map((column) => (
              <option key={column.key} value={column.key}>{column.title}</option>
            ))}
          </select>
        </label>
      )}
    </>
  )
}
