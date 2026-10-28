import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react'
import DataGridPager from './DataGridPager.js'
import DataGridRow from './DataGridRow.js'
import DataGridTable from './DataGridTable.js'
import DataGridToolbar from './DataGridToolbar.js'
import type {
  DataGridColumn,
  GridData,
  GridEditing,
  GridEntry,
  GridSort,
  GridState,
  GridStateVirtualize,
} from './DataGrid.types.js'
export type {
  DataGridColumn,
  GridData,
  GridSort,
  GridState,
  GridStateVirtualize,
} from './DataGrid.types.js'

export type DataGridProps<T> = {
  columns: readonly DataGridColumn<T>[]
  items?: readonly T[]
  serverData?: (state: GridState) => Promise<GridData<T>>
  virtualizeServerData?: (
    state: GridStateVirtualize,
    signal: AbortSignal,
  ) => Promise<GridData<T>>
  getRowId?: (item: T) => string | number
  sortMode?: 'None' | 'Single' | 'Multiple'
  allowUnsorted?: boolean
  filterable?: boolean
  filterMode?: 'Simple' | 'ColumnFilterMenu' | 'ColumnFilterRow'
  quickFilter?: (item: T) => boolean
  multiSelection?: boolean
  selectedItem?: T
  selectedItems?: ReadonlySet<T>
  selectOnRowClick?: boolean
  comparer?: (left: T, right: T) => boolean
  onSelectedItemChanged?: (item: T | undefined) => void
  onSelectedItemsChanged?: (items: Set<T>) => void
  readOnly?: boolean
  editMode?: 'Cell' | 'Form'
  editTrigger?: 'Manual' | 'OnRowClick'
  canCancelEdit?: boolean
  onStartedEditingItem?: (item: T) => void
  onCommittedItemChanges?: (item: T) => void
  onCanceledEditingItem?: (item: T) => void
  onFormFieldChanged?: (item: T, columnKey: string, value: unknown) => void
  dense?: boolean
  striped?: boolean
  hover?: boolean
  bordered?: boolean
  outlined?: boolean
  elevation?: number
  square?: boolean
  height?: string
  fixedHeader?: boolean
  fixedFooter?: boolean
  horizontalScrollbar?: boolean
  groupable?: boolean
  hideable?: boolean
  resizable?: boolean
  showColumnOptions?: boolean
  showFilterIcons?: boolean
  virtualize?: boolean
  rowHeight?: number
  groupExpanded?: boolean
  expandSingleRow?: boolean
  childRowContent?: (item: T) => ReactNode
  dragDropColumnReordering?: boolean
  columnsPanelReordering?: boolean
  columnResizeMode?: 'Container' | 'Column'
  currentPage?: number
  rowsPerPage?: number
  pageSizeOptions?: readonly number[]
  onCurrentPageChanged?: (page: number) => void
  onRowsPerPageChanged?: (pageSize: number) => void
  onRowClick?: (item: T, event: MouseEvent<HTMLTableRowElement>) => void
  onRowContextMenuClick?: (item: T, event: MouseEvent<HTMLTableRowElement>) => void
  toolbarContent?: ReactNode
  pagerContent?: ReactNode
  noRecordsContent?: ReactNode
  loadingContent?: ReactNode
  className?: string
}

function compareValues(left: unknown, right: unknown) {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export default function DataGrid<T>({
  columns,
  items,
  serverData,
  virtualizeServerData,
  getRowId,
  sortMode = 'Multiple',
  allowUnsorted = false,
  filterable = false,
  filterMode = 'Simple',
  quickFilter,
  multiSelection = false,
  selectedItem,
  selectedItems,
  selectOnRowClick = true,
  comparer = Object.is,
  onSelectedItemChanged,
  onSelectedItemsChanged,
  readOnly = true,
  editMode = 'Cell',
  editTrigger = 'Manual',
  canCancelEdit = true,
  onStartedEditingItem,
  onCommittedItemChanges,
  onCanceledEditingItem,
  onFormFieldChanged,
  dense = false,
  striped = false,
  hover = false,
  bordered = false,
  outlined = false,
  elevation = 1,
  square = false,
  height,
  fixedHeader = false,
  fixedFooter = false,
  horizontalScrollbar = false,
  groupable = false,
  hideable = false,
  resizable = false,
  showColumnOptions = true,
  showFilterIcons = true,
  virtualize = false,
  rowHeight = 48,
  groupExpanded = true,
  expandSingleRow = false,
  childRowContent,
  dragDropColumnReordering = false,
  columnsPanelReordering = false,
  columnResizeMode = 'Column',
  currentPage,
  rowsPerPage,
  pageSizeOptions = [5, 10, 25, 50],
  onCurrentPageChanged,
  onRowsPerPageChanged,
  onRowClick,
  onRowContextMenuClick,
  toolbarContent,
  pagerContent,
  noRecordsContent,
  loadingContent,
  className,
}: DataGridProps<T>) {
  const sourceCount = Number(items !== undefined) +
    Number(serverData !== undefined) +
    Number(virtualizeServerData !== undefined)
  if (sourceCount !== 1) {
    throw new Error('DataGrid requires exactly one of items, serverData, or virtualizeServerData.')
  }
  if ((virtualize || virtualizeServerData !== undefined) && !height) {
    throw new Error('DataGrid virtualization requires a height.')
  }

  const [sorts, setSorts] = useState<GridSort[]>([])
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [pageInternal, setPageInternal] = useState(0)
  const page = currentPage ?? pageInternal
  const [pageSizeInternal, setPageSizeInternal] = useState(rowsPerPage ?? 10)
  const pageSize = rowsPerPage ?? pageSizeInternal
  const [serverItems, setServerItems] = useState<readonly T[]>([])
  const [serverTotal, setServerTotal] = useState(0)
  const [virtualItems, setVirtualItems] = useState<readonly T[]>([])
  const [virtualTotal, setVirtualTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    () => columns.map((column) => column.key),
  )
  const [columnOrder, setColumnOrder] = useState<string[]>(
    () => columns.map((column) => column.key),
  )
  const [groupBy, setGroupBy] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(),
  )
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set())
  const [editing, setEditing] = useState<GridEditing<T>>()
  const [columnMenuOpen, setColumnMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>()
  const [scrollTop, setScrollTop] = useState(0)
  const [resize, setResize] = useState<{ key: string; x: number; width: number }>()
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [draggedColumn, setDraggedColumn] = useState<string>()
  const [internalSelectedItem, setInternalSelectedItem] = useState<T>()
  const [internalSelectedItems, setInternalSelectedItems] = useState<Set<T>>(
    () => new Set(),
  )
  const scrollContainer = useRef<HTMLDivElement>(null)
  const virtualFetchInProgress = useRef(false)
  const virtualLoadController = useRef<AbortController | null>(null)
  const serverDataRef = useRef(serverData)
  const virtualizeServerDataRef = useRef(virtualizeServerData)

  const orderedColumns = useMemo(() => {
    const available = new Map(columns.map((column) => [column.key, column]))
    return columnOrder
      .map((key) => available.get(key))
      .filter((column): column is DataGridColumn<T> => column !== undefined)
      .filter((column) => visibleColumnKeys.includes(column.key))
  }, [columns, columnOrder, visibleColumnKeys])

  const queryState = useMemo<GridState>(() => ({
    page,
    pageSize,
    sorts,
    filters,
    groupBy: groupBy || undefined,
  }), [page, pageSize, sorts, filters, groupBy])
  const effectiveRowHeight = Number.isFinite(rowHeight)
    ? Math.max(1, rowHeight)
    : 48
  const hasServerData = serverData !== undefined
  const hasVirtualizeServerData = virtualizeServerData !== undefined

  useEffect(() => {
    serverDataRef.current = serverData
  }, [serverData])

  useEffect(() => {
    virtualizeServerDataRef.current = virtualizeServerData
  }, [virtualizeServerData])

  useEffect(() => {
    const loadData = serverDataRef.current
    if (!loadData) return
    let active = true
    setLoading(true)
    setError(undefined)
    loadData(queryState)
      .then((result) => {
        if (!active) return
        setServerItems(result.items)
        setServerTotal(result.totalItems)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Unable to load grid data.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [hasServerData, queryState])

  useEffect(() => {
    const loadData = virtualizeServerDataRef.current
    if (!loadData) return
    const controller = new AbortController()
    let active = true
    virtualFetchInProgress.current = true
    setLoading(true)
    setError(undefined)
    loadData(
      { ...queryState, startIndex: 0, count: queryState.pageSize },
      controller.signal,
    )
      .then((result) => {
        if (!active) return
        setVirtualItems(result.items)
        setVirtualTotal(result.totalItems)
      })
      .catch((cause: unknown) => {
        if (active && !controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Unable to load grid data.')
        }
      })
      .finally(() => {
        if (active) {
          virtualFetchInProgress.current = false
          setLoading(false)
        }
      })
    return () => {
      active = false
      controller.abort()
      virtualLoadController.current?.abort()
      virtualLoadController.current = null
    }
  }, [hasVirtualizeServerData, queryState])

  useEffect(() => {
    if (!resize) return
    const move = (event: PointerEvent) => {
      const width = Math.max(72, resize.width + event.clientX - resize.x)
      setColumnWidths((current) => ({ ...current, [resize.key]: width }))
    }
    const finish = () => setResize(undefined)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', finish, { once: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', finish)
    }
  }, [resize])

  const setPage = (nextPage: number) => {
    const safePage = Math.max(0, nextPage)
    setPageInternal(safePage)
    onCurrentPageChanged?.(safePage)
  }

  const setPageSize = (nextPageSize: number) => {
    setPageSizeInternal(nextPageSize)
    setPage(0)
    onRowsPerPageChanged?.(nextPageSize)
  }

  const setFilter = (key: string, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(0)
  }

  const toggleSort = (column: DataGridColumn<T>, additive: boolean) => {
    if (column.sortable === false || sortMode === 'None') return
    setSorts((current) => {
      const existing = current.find((sort) => sort.columnKey === column.key)
      const nextDirection = !existing
        ? 'asc'
        : existing.direction === 'asc'
          ? 'desc'
          : allowUnsorted
            ? undefined
            : 'asc'
      const next = additive && sortMode === 'Multiple'
        ? current.filter((sort) => sort.columnKey !== column.key)
        : []
      if (nextDirection) next.push({ columnKey: column.key, direction: nextDirection })
      return next
    })
    setPage(0)
  }

  const clientRows = useMemo(() => {
    if (items === undefined) return []
    let result = items.map((item, index) => ({ item, index }))
    if (filterMode === 'Simple' && search.trim()) {
      const query = search.trim().toLocaleLowerCase()
      result = result.filter(({ item }) =>
        columns.some((column) =>
          String(column.value(item) ?? '').toLocaleLowerCase().includes(query),
        ),
      )
    }
    if (quickFilter) result = result.filter(({ item }) => quickFilter(item))
    result = result.filter(({ item }) =>
      Object.entries(filters).every(([key, filter]) => {
        if (!filter.trim()) return true
        const column = columns.find((candidate) => candidate.key === key)
        return column !== undefined &&
          String(column.value(item) ?? '').toLocaleLowerCase()
            .includes(filter.trim().toLocaleLowerCase())
      }),
    )
    if (sorts.length > 0) {
      result = [...result].sort((left, right) => {
        for (const sort of sorts) {
          const column = columns.find((candidate) => candidate.key === sort.columnKey)
          if (!column) continue
          const comparison = compareValues(column.value(left.item), column.value(right.item))
          if (comparison !== 0) return sort.direction === 'asc' ? comparison : -comparison
        }
        return 0
      })
    }
    return result
  }, [items, columns, search, filterMode, quickFilter, filters, sorts])

  const sourceRows: GridEntry<T>[] = items !== undefined
    ? clientRows
    : serverData !== undefined
      ? serverItems.map((item, index) => ({ item, index: page * pageSize + index }))
      : virtualItems.map((item, index) => ({ item, index }))
  const totalItems = items !== undefined
    ? clientRows.length
    : serverData !== undefined
      ? serverTotal
      : virtualTotal
  const pagedRows = items !== undefined && !virtualize
    ? sourceRows.slice(page * pageSize, (page + 1) * pageSize)
    : sourceRows
  const visibleStartIndex = virtualize && items !== undefined
    ? Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - 5)
    : 0
  const visibleRows = virtualize && items !== undefined
    ? pagedRows.slice(
      visibleStartIndex,
      visibleStartIndex + Math.ceil(440 / effectiveRowHeight) + 10,
    )
    : pagedRows
  const virtualOffset = virtualize && items !== undefined
    ? visibleStartIndex * effectiveRowHeight
    : 0
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))
  const hasFooter = orderedColumns.some((column) => column.footer !== undefined)
  const hasRowActions = childRowContent !== undefined || !readOnly
  const canGroupColumns = groupable || columns.some((column) => column.groupable === true)
  const canHideColumn = (column: DataGridColumn<T>) =>
    column.hideable ?? hideable
  const selectedItemValue = selectedItem !== undefined
    ? selectedItem
    : internalSelectedItem
  const selectedItemsValue = selectedItems ?? internalSelectedItems

  const isSelected = (item: T) => multiSelection
    ? [...selectedItemsValue].some((selected) => comparer(selected, item))
    : selectedItemValue !== undefined && comparer(selectedItemValue, item)

  const handleSelection = (item: T) => {
    if (multiSelection) {
      const next = new Set(selectedItemsValue)
      const existing = [...next].find((selected) => comparer(selected, item))
      if (existing !== undefined) next.delete(existing)
      else next.add(item)
      setInternalSelectedItems(next)
      onSelectedItemsChanged?.(next)
    } else {
      const next = selectedItemValue !== undefined && comparer(selectedItemValue, item)
        ? undefined
        : item
      setInternalSelectedItem(next)
      onSelectedItemChanged?.(next)
    }
  }

  const rowId = (item: T, index: number) => String(getRowId?.(item) ?? index)
  const startEditing = (item: T, index: number, columnKey?: string) => {
    if (readOnly) return
    const id = rowId(item, index)
    setEditing({ id, item, draft: { ...item }, columnKey })
    onStartedEditingItem?.(item)
  }
  const updateDraft = (column: DataGridColumn<T>, value: unknown) => {
    if (!editing) return
    const draft = column.update?.(editing.draft, value) ?? editing.draft
    setEditing({ ...editing, draft })
    onFormFieldChanged?.(editing.item, column.key, value)
  }
  const commitEditing = () => {
    if (!editing) return
    onCommittedItemChanges?.(editing.draft)
    setEditing(undefined)
  }
  const cancelEditing = () => {
    if (!editing || !canCancelEdit) return
    onCanceledEditingItem?.(editing.item)
    setEditing(undefined)
  }

  const groupColumn = columns.find((column) => column.key === groupBy)
  const groups = groupColumn
    ? visibleRows.reduce((result, entry) => {
      const key = String(groupColumn.value(entry.item) ?? '(empty)')
      const group = result.get(key) ?? []
      group.push(entry)
      result.set(key, group)
      return result
    }, new Map<string, GridEntry<T>[]>())
    : undefined

  const toggleGroup = (key: string) => {
    setExpandedGroups((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleVirtualScroll = () => {
    const element = scrollContainer.current
    if (!element) return
    setScrollTop(element.scrollTop)
    if (
      !virtualizeServerData ||
      virtualFetchInProgress.current ||
      virtualItems.length >= virtualTotal ||
      element.scrollTop + element.clientHeight < element.scrollHeight - effectiveRowHeight * 4
    ) return
    virtualFetchInProgress.current = true
    const controller = new AbortController()
    virtualLoadController.current = controller
    virtualizeServerData(
      { ...queryState, startIndex: virtualItems.length, count: pageSize },
      controller.signal,
    )
      .then((result) => {
        if (controller.signal.aborted) return
        setVirtualItems((current) => [...current, ...result.items])
        setVirtualTotal(result.totalItems)
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Unable to load grid data.')
        }
      })
      .finally(() => {
        if (virtualLoadController.current === controller) {
          virtualLoadController.current = null
          virtualFetchInProgress.current = false
        }
      })
  }

  const toggleColumn = (key: string) => {
    setVisibleColumnKeys((current) => current.includes(key)
      ? current.filter((columnKey) => columnKey !== key)
      : [...current, key])
  }

  const reorderColumn = (source: string, target: string) => {
    setColumnOrder((current) => {
      const next = current.filter((key) => key !== source)
      const targetIndex = next.indexOf(target)
      next.splice(targetIndex < 0 ? next.length : targetIndex, 0, source)
      return next
    })
  }

  const gridClasses = [
    'data-grid',
    dense && 'data-grid--dense',
    striped && 'data-grid--striped',
    hover && 'data-grid--hover',
    bordered && 'data-grid--bordered',
    outlined && 'data-grid--outlined',
    square && 'data-grid--square',
    horizontalScrollbar && 'data-grid--horizontal',
    className,
  ].filter(Boolean).join(' ')
  const safeElevation = Number.isFinite(elevation)
    ? Math.max(0, Math.min(24, Math.trunc(elevation)))
    : 0
  const gridStyle: CSSProperties = {
    boxShadow: safeElevation === 0
      ? 'none'
      : `0 ${safeElevation}px ${safeElevation * 3}px rgb(28 25 23 / 12%)`,
  }
  const totalColumnCount = orderedColumns.length + Number(multiSelection) + Number(hasRowActions)

  const renderEditor = (column: DataGridColumn<T>, item: T) =>
    column.editor
      ? column.editor(
        column.value(item),
        (value) => updateDraft(column, value),
        item,
      )
      : (
        <input
          aria-label={`Edit ${column.title}`}
          value={String(column.value(item) ?? '')}
          onChange={(event) => updateDraft(column, event.target.value)}
        />
      )

  return (
    <section className={gridClasses} style={gridStyle} data-edit-mode={editMode.toLowerCase()}>
      <DataGridToolbar
        columns={columns}
        toolbarContent={toolbarContent}
        filterable={filterable}
        filterMode={filterMode}
        showColumnOptions={showColumnOptions}
        columnsPanelReordering={columnsPanelReordering}
        columnMenuOpen={columnMenuOpen}
        onToggleColumnMenu={() => setColumnMenuOpen((open) => !open)}
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(0)
        }}
        visibleColumnKeys={visibleColumnKeys}
        canHideColumn={canHideColumn}
        onToggleColumn={toggleColumn}
        columnOrder={columnOrder}
        onColumnOrderChange={setColumnOrder}
        canGroupColumns={canGroupColumns}
        groupable={groupable}
        groupBy={groupBy}
        onGroupByChange={(key) => {
          setGroupBy(key)
          setExpandedGroups(new Set())
          setPage(0)
        }}
      />
      {error && <p className="data-grid__error" role="alert">{error}</p>}
      <DataGridTable
        columns={orderedColumns}
        scrollContainer={scrollContainer}
        height={height}
        onScroll={handleVirtualScroll}
        fixedHeader={fixedHeader}
        multiSelection={multiSelection}
        sorts={sorts}
        sortMode={sortMode}
        dragDropColumnReordering={dragDropColumnReordering}
        draggedColumn={draggedColumn}
        onDraggedColumnChange={setDraggedColumn}
        onReorderColumn={reorderColumn}
        columnWidths={columnWidths}
        onToggleSort={toggleSort}
        filterable={filterable}
        filterMode={filterMode}
        showFilterIcons={showFilterIcons}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        filters={filters}
        onFilterChange={setFilter}
        resizable={resizable}
        columnResizeMode={columnResizeMode}
        onResizeStart={(key, x, width) => setResize({ key, x, width })}
        hasRowActions={hasRowActions}
        virtualize={virtualize}
        hasClientItems={items !== undefined}
        virtualOffset={virtualOffset}
        totalColumnCount={totalColumnCount}
        groups={groups}
        expandedGroups={expandedGroups}
        groupExpanded={groupExpanded}
        onToggleGroup={toggleGroup}
        renderRow={renderRow}
        visibleRows={visibleRows}
        pagedRows={pagedRows}
        visibleStartIndex={visibleStartIndex}
        effectiveRowHeight={effectiveRowHeight}
        hasVirtualizeServerData={virtualizeServerData !== undefined}
        virtualItemCount={virtualItems.length}
        virtualTotal={virtualTotal}
        loading={loading}
        noRecordsContent={noRecordsContent}
        hasFooter={hasFooter}
        fixedFooter={fixedFooter}
        loadingContent={loadingContent}
      />
      {!virtualize && !virtualizeServerData && (
        <DataGridPager
          pagerContent={pagerContent}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          totalItems={totalItems}
          pageCount={pageCount}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </section>
  )

  function renderRow(entry: GridEntry<T>) {
    const id = rowId(entry.item, entry.index)
    return (
      <DataGridRow
        key={id}
        entry={entry}
        rowId={id}
        selected={isSelected(entry.item)}
        editing={editing?.id === id ? editing : undefined}
        columns={orderedColumns}
        columnWidths={columnWidths}
        multiSelection={multiSelection}
        striped={striped}
        readOnly={readOnly}
        editMode={editMode}
        editTrigger={editTrigger}
        canCancelEdit={canCancelEdit}
        selectOnRowClick={selectOnRowClick}
        childRowContent={childRowContent}
        expanded={expandedRows.has(id)}
        onSelect={handleSelection}
        onStartEditing={startEditing}
        onCommitEditing={commitEditing}
        onCancelEditing={cancelEditing}
        onToggleExpanded={(rowId, isExpanded) => {
          setExpandedRows((current) => {
            const next = expandSingleRow ? new Set<string>() : new Set(current)
            if (!isExpanded) next.add(rowId)
            return next
          })
        }}
        renderEditor={renderEditor}
        onRowClick={onRowClick}
        onRowContextMenuClick={onRowContextMenuClick}
      />
    )
  }
}
