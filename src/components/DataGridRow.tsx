import type { MouseEvent, ReactNode } from 'react'
import type {
  DataGridColumn,
  GridEditing,
  GridEntry,
} from './DataGrid.types.js'

type DataGridRowProps<T> = {
  entry: GridEntry<T>
  rowId: string
  selected: boolean
  editing?: GridEditing<T>
  columns: readonly DataGridColumn<T>[]
  columnWidths: Readonly<Record<string, number>>
  multiSelection: boolean
  striped: boolean
  readOnly: boolean
  editMode: 'Cell' | 'Form'
  editTrigger: 'Manual' | 'OnRowClick'
  canCancelEdit: boolean
  selectOnRowClick: boolean
  childRowContent?: (item: T) => ReactNode
  expanded: boolean
  onSelect: (item: T) => void
  onStartEditing: (item: T, index: number, columnKey?: string) => void
  onCommitEditing: () => void
  onCancelEditing: () => void
  onToggleExpanded: (id: string, expanded: boolean) => void
  renderEditor: (column: DataGridColumn<T>, item: T) => ReactNode
  onRowClick?: (item: T, event: MouseEvent<HTMLTableRowElement>) => void
  onRowContextMenuClick?: (item: T, event: MouseEvent<HTMLTableRowElement>) => void
}

export default function DataGridRow<T>({
  entry,
  rowId,
  selected,
  editing,
  columns,
  columnWidths,
  multiSelection,
  striped,
  readOnly,
  editMode,
  editTrigger,
  canCancelEdit,
  selectOnRowClick,
  childRowContent,
  expanded,
  onSelect,
  onStartEditing,
  onCommitEditing,
  onCancelEditing,
  onToggleExpanded,
  renderEditor,
  onRowClick,
  onRowContextMenuClick,
}: DataGridRowProps<T>) {
  const { item, index } = entry
  const rowEditing = editing?.id === rowId
  const rowItem = rowEditing ? editing.draft : item
  const canExpand = childRowContent !== undefined

  return (
    <FragmentRow
      rowId={rowId}
      selected={selected}
      striped={striped && index % 2 === 1}
      onClick={(event) => {
        const target = event.target
        const clickedControl = target instanceof Element &&
          target.closest('a, button, input, textarea, select, [contenteditable="true"]') !== null
        if (clickedControl) return
        if (selectOnRowClick && !rowEditing) onSelect(item)
        if (editTrigger === 'OnRowClick' && !rowEditing) onStartEditing(item, index)
        onRowClick?.(item, event)
      }}
      onContextMenu={(event) => onRowContextMenuClick?.(item, event)}
      childRow={expanded && childRowContent ? (
        <tr className="data-grid__child-row">
          <td colSpan={columns.length + Number(multiSelection) + 1}>
            {childRowContent(item)}
          </td>
        </tr>
      ) : undefined}
    >
      {multiSelection && (
        <td className="data-grid__selection-cell">
          <input
            type="checkbox"
            aria-label={`Select row ${rowId}`}
            checked={selected}
            onChange={() => onSelect(item)}
            onClick={(event) => event.stopPropagation()}
          />
        </td>
      )}
      {rowEditing && !readOnly && editMode === 'Form' ? (
        <td className="data-grid__form-cell" colSpan={columns.length}>
          <div className="data-grid__edit-form">
            {columns.filter((column) => column.editor || column.update).map((column) => (
              <label key={column.key}>
                <span>{column.title}</span>
                {renderEditor(column, rowItem)}
              </label>
            ))}
            {columns.every((column) => !column.editor && !column.update) && (
              <span>No editable fields are configured for this row.</span>
            )}
          </div>
        </td>
      ) : columns.map((column) => (
        <td
          key={column.key}
          style={{
            textAlign: column.align,
            width: columnWidths[column.key] ?? column.width,
          }}
          onDoubleClick={() => onStartEditing(item, index, column.key)}
        >
          {rowEditing && !readOnly && editMode === 'Cell' &&
            (editing?.columnKey === undefined || editing.columnKey === column.key) &&
            (column.editor || column.update)
            ? renderEditor(column, rowItem)
            : column.render?.(rowItem) ?? String(column.value(rowItem) ?? '')}
        </td>
      ))}
      {(rowEditing || canExpand || !readOnly) && (
        <td className="data-grid__row-actions">
          {!readOnly && !rowEditing && editTrigger === 'Manual' && (
            <button
              type="button"
              aria-label={`Edit row ${rowId}`}
              onClick={(event) => { event.stopPropagation(); onStartEditing(item, index) }}
            >Edit</button>
          )}
          {rowEditing && (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); onCommitEditing() }}>Save</button>
              {canCancelEdit && (
                <button type="button" onClick={(event) => { event.stopPropagation(); onCancelEditing() }}>Cancel</button>
              )}
            </>
          )}
          {canExpand && (
            <button
              type="button"
              aria-label={`${expanded ? 'Collapse' : 'Expand'} row ${rowId}`}
              aria-expanded={expanded}
              onClick={(event) => {
                event.stopPropagation()
                onToggleExpanded(rowId, expanded)
              }}
            >{expanded ? '−' : '+'}</button>
          )}
        </td>
      )}
    </FragmentRow>
  )
}

function FragmentRow({
  rowId,
  selected,
  striped,
  onClick,
  onContextMenu,
  childRow,
  children,
}: {
  rowId: string
  selected: boolean
  striped: boolean
  onClick: (event: MouseEvent<HTMLTableRowElement>) => void
  onContextMenu: (event: MouseEvent<HTMLTableRowElement>) => void
  childRow?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <tr
        data-row-id={rowId}
        aria-selected={selected}
        className={striped ? 'data-grid__row data-grid__row--striped' : 'data-grid__row'}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        {children}
      </tr>
      {childRow}
    </>
  )
}
