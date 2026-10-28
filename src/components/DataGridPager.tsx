import type { ReactNode } from 'react'

type DataGridPagerProps = {
  pagerContent?: ReactNode
  page: number
  pageSize: number
  pageSizeOptions: readonly number[]
  totalItems: number
  pageCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function DataGridPager({
  pagerContent,
  page,
  pageSize,
  pageSizeOptions,
  totalItems,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: DataGridPagerProps) {
  return (
    <div className="data-grid__pager">
      {pagerContent ?? (
        <>
          <label>
            Rows per page
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <span>{totalItems === 0 ? '0' : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalItems)}`} of {totalItems}</span>
          <button type="button" aria-label="Previous page" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>←</button>
          <button type="button" aria-label="Next page" disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}>→</button>
        </>
      )}
    </div>
  )
}
