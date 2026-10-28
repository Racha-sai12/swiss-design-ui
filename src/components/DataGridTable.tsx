import type { ReactNode, RefObject } from 'react'
import type {
  DataGridColumn,
  GridEntry,
  GridSort,
} from './DataGrid.types.js'

type DataGridTableProps<T> = {
  columns: readonly DataGridColumn<T>[]
  scrollContainer: RefObject<HTMLDivElement | null>
  height?: string
  onScroll: () => void
  fixedHeader: boolean
  multiSelection: boolean
  sorts: readonly GridSort[]
  sortMode: 'None' | 'Single' | 'Multiple'
  dragDropColumnReordering: boolean
  draggedColumn?: string
  onDraggedColumnChange: (key: string | undefined) => void
  onReorderColumn: (source: string, target: string) => void
  columnWidths: Readonly<Record<string, number>>
  onToggleSort: (column: DataGridColumn<T>, additive: boolean) => void
  filterable: boolean
  filterMode: 'Simple' | 'ColumnFilterMenu' | 'ColumnFilterRow'
  showFilterIcons: boolean
  activeFilter?: string
  onActiveFilterChange: (key: string | undefined) => void
  filters: Readonly<Record<string, string>>
  onFilterChange: (key: string, value: string) => void
  resizable: boolean
  columnResizeMode: 'Container' | 'Column'
  onResizeStart: (key: string, x: number, width: number) => void
  hasRowActions: boolean
  virtualize: boolean
  hasClientItems: boolean
  virtualOffset: number
  totalColumnCount: number
  groups?: Map<string, GridEntry<T>[]>
  expandedGroups: ReadonlySet<string>
  groupExpanded: boolean
  onToggleGroup: (key: string) => void
  renderRow: (entry: GridEntry<T>) => ReactNode
  visibleRows: GridEntry<T>[]
  pagedRows: GridEntry<T>[]
  visibleStartIndex: number
  effectiveRowHeight: number
  hasVirtualizeServerData: boolean
  virtualItemCount: number
  virtualTotal: number
  loading: boolean
  noRecordsContent?: ReactNode
  hasFooter: boolean
  fixedFooter: boolean
  loadingContent?: ReactNode
}

export default function DataGridTable<T>({
  columns,
  scrollContainer,
  height,
  onScroll,
  fixedHeader,
  multiSelection,
  sorts,
  sortMode,
  dragDropColumnReordering,
  draggedColumn,
  onDraggedColumnChange,
  onReorderColumn,
  columnWidths,
  onToggleSort,
  filterable,
  filterMode,
  showFilterIcons,
  activeFilter,
  onActiveFilterChange,
  filters,
  onFilterChange,
  resizable,
  columnResizeMode,
  onResizeStart,
  hasRowActions,
  virtualize,
  hasClientItems,
  virtualOffset,
  totalColumnCount,
  groups,
  expandedGroups,
  groupExpanded,
  onToggleGroup,
  renderRow,
  visibleRows,
  pagedRows,
  visibleStartIndex,
  effectiveRowHeight,
  hasVirtualizeServerData,
  virtualItemCount,
  virtualTotal,
  loading,
  noRecordsContent,
  hasFooter,
  fixedFooter,
  loadingContent,
}: DataGridTableProps<T>) {
  return (
    <div
      ref={scrollContainer}
      className="data-grid__scroll"
      style={height ? { maxHeight: height, height } : undefined}
      onScroll={onScroll}
    >
      <table>
        <thead className={fixedHeader ? 'data-grid__fixed-header' : undefined}>
          <tr>
            {multiSelection && (
              <th className="data-grid__selection-cell" scope="col">
                <span className="data-grid__sr-only">Selection</span>
              </th>
            )}
            {columns.map((column) => {
              const sort = sorts.find((current) => current.columnKey === column.key)
              const canSort = column.sortable !== false && sortMode !== 'None'
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sort ? sort.direction === 'asc' ? 'ascending' : 'descending' : undefined}
                  draggable={dragDropColumnReordering}
                  onDragStart={() => onDraggedColumnChange(column.key)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedColumn) onReorderColumn(draggedColumn, column.key)
                    onDraggedColumnChange(undefined)
                  }}
                  style={{
                    width: columnWidths[column.key] ?? column.width,
                    textAlign: column.align,
                  }}
                >
                  <div className="data-grid__heading">
                    <button
                      className={canSort ? 'data-grid__sort' : 'data-grid__sort data-grid__sort--static'}
                      type="button"
                      disabled={!canSort}
                      onClick={(event) => onToggleSort(column, event.shiftKey)}
                    >
                      {column.title}
                      {canSort && (
                        <span className="data-grid__sort-indicator" aria-hidden="true">
                          {sort ? sort.direction === 'asc' ? '↑' : '↓' : '↕'}
                          {sort && sortMode === 'Multiple'
                            ? sorts.findIndex((current) => current.columnKey === column.key) + 1
                            : ''}
                        </span>
                      )}
                    </button>
                    {filterable && column.filterable !== false && showFilterIcons &&
                      filterMode === 'ColumnFilterMenu' && (
                        <button
                          className="data-grid__filter-toggle"
                          type="button"
                          aria-label={`Filter ${column.title}`}
                          aria-expanded={activeFilter === column.key}
                          onClick={() => onActiveFilterChange(
                            activeFilter === column.key ? undefined : column.key,
                          )}
                        >⌕</button>
                      )}
                  </div>
                  {activeFilter === column.key && filterMode === 'ColumnFilterMenu' && (
                    <input
                      className="data-grid__column-filter"
                      aria-label={`Filter ${column.title}`}
                      value={filters[column.key] ?? ''}
                      onChange={(event) => onFilterChange(column.key, event.target.value)}
                    />
                  )}
                  {(column.resizable ?? resizable) && (
                    <span
                      className={`data-grid__resize data-grid__resize--${columnResizeMode.toLowerCase()}`}
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize ${column.title}`}
                      onPointerDown={(event) => {
                        const width = event.currentTarget.parentElement?.getBoundingClientRect().width ?? 120
                        onResizeStart(column.key, event.clientX, width)
                      }}
                    />
                  )}
                </th>
              )
            })}
            {hasRowActions && <th className="data-grid__row-actions-heading" scope="col">Actions</th>}
          </tr>
          {filterable && filterMode === 'ColumnFilterRow' && (
            <tr className="data-grid__filter-row">
              {multiSelection && <th />}
              {columns.map((column) => (
                <th key={column.key}>
                  {column.filterable !== false && (
                    <input
                      aria-label={`Filter ${column.title}`}
                      placeholder="Filter"
                      value={filters[column.key] ?? ''}
                      onChange={(event) => onFilterChange(column.key, event.target.value)}
                    />
                  )}
                </th>
              ))}
              {hasRowActions && <th />}
            </tr>
          )}
        </thead>
        <tbody>
          {virtualize && hasClientItems && virtualOffset > 0 && (
            <tr aria-hidden="true" className="data-grid__spacer">
              <td colSpan={totalColumnCount} style={{ height: virtualOffset }} />
            </tr>
          )}
          {groups
            ? [...groups.entries()].map(([groupName, entries]) => {
              const isExpanded = expandedGroups.has(groupName)
                ? !groupExpanded
                : groupExpanded
              return (
                <FragmentGroup
                  key={groupName}
                  name={groupName}
                  count={entries.length}
                  expanded={isExpanded}
                  colSpan={totalColumnCount}
                  onToggle={() => onToggleGroup(groupName)}
                >
                  {isExpanded && entries.map((entry) => renderRow(entry))}
                </FragmentGroup>
              )
            })
            : visibleRows.map((entry) => renderRow(entry))}
          {virtualize && hasClientItems && visibleRows.length < pagedRows.length && (
            <tr aria-hidden="true" className="data-grid__spacer">
              <td
                colSpan={totalColumnCount}
                style={{
                  height: Math.max(
                    0,
                    (pagedRows.length - visibleStartIndex - visibleRows.length) * effectiveRowHeight,
                  ),
                }}
              />
            </tr>
          )}
          {hasVirtualizeServerData && virtualItemCount < virtualTotal && (
            <tr aria-hidden="true" className="data-grid__spacer">
              <td colSpan={totalColumnCount} style={{ height: (virtualTotal - virtualItemCount) * effectiveRowHeight }} />
            </tr>
          )}
          {!loading && visibleRows.length === 0 && (
            <tr>
              <td className="data-grid__empty" colSpan={totalColumnCount}>
                {noRecordsContent ?? 'No records to display'}
              </td>
            </tr>
          )}
        </tbody>
        {hasFooter && (
          <tfoot className={fixedFooter ? 'data-grid__fixed-footer' : undefined}>
            <tr>
              {multiSelection && <td />}
              {columns.map((column) => <td key={column.key}>{column.footer}</td>)}
              {hasRowActions && <td />}
            </tr>
          </tfoot>
        )}
      </table>
      {loading && (
        <div className="data-grid__loading" role="status">
          {loadingContent ?? 'Loading…'}
        </div>
      )}
    </div>
  )
}

function FragmentGroup({
  name,
  count,
  expanded,
  colSpan,
  onToggle,
  children,
}: {
  name: string
  count: number
  expanded: boolean
  colSpan: number
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <>
      <tr className="data-grid__group-row">
        <th colSpan={colSpan} scope="rowgroup">
          <button type="button" aria-expanded={expanded} onClick={onToggle}>
            <span aria-hidden="true">{expanded ? '−' : '+'}</span>
            {name}
            <span className="data-grid__group-count">{count}</span>
          </button>
        </th>
      </tr>
      {children}
    </>
  )
}
