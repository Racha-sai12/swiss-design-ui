import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { dataGridProps } from '../apiReference'
import DataGrid from '../../components/DataGrid'
import { dataGridColumns, initialGridRows, type Employee } from '../dataGridDemo'

type PageProps = { activePage: string }

export default function DataGridPage({ activePage }: PageProps) {
  const [gridRows, setGridRows] = useState(initialGridRows)
  const [gridSelectedRows, setGridSelectedRows] = useState<Set<Employee>>(new Set())
  return (
    <section className="component-entry" id="data-grid" aria-labelledby="data-grid-title" hidden={activePage !== "data-grid"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Component / 07</p>
        <h2 id="data-grid-title">DataGrid</h2>
        <p>
          A typed data table with client or server data, sorting, filtering,
          selection, inline editing, grouping, and optional row virtualization.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="data-grid-preview-title">
          <div className="panel-heading">
            <h3 id="data-grid-preview-title">Preview</h3>
            <span>Interactive / Client data</span>
          </div>
          <DataGrid
            columns={dataGridColumns}
            items={gridRows}
            getRowId={(row) => row.id}
            multiSelection
            selectedItems={gridSelectedRows}
            onSelectedItemsChanged={setGridSelectedRows}
            comparer={(left, right) => left.id === right.id}
            filterable
            filterMode="ColumnFilterRow"
            groupable
            hideable
            resizable
            striped
            hover
            outlined
            readOnly={false}
            editMode="Cell"
            onCommittedItemChanges={(updatedRow) => {
              setGridRows((current) => current.map((row) =>
                row.id === updatedRow.id ? updatedRow : row,
              ))
            }}
          />
        </section>

        <section className="props-panel" aria-labelledby="data-grid-props-title">
          <div className="panel-heading">
            <h3 id="data-grid-props-title">Properties</h3>
            <span>API reference</span>
          </div>
          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Type</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <PropsTableRows rows={dataGridProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="data-grid-usage-title">
          <div className="panel-heading">
            <h3 id="data-grid-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`const columns: DataGridColumn<Employee>[] = [
  { key: "name", title: "Name", value: (row) => row.name },
  { key: "team", title: "Team", value: (row) => row.team },
  {
    key: "salary",
    title: "Salary",
    value: (row) => row.salary,
    update: (row, value) => ({ ...row, salary: Number(value) }),
  },
]

<DataGrid
  columns={columns}
  items={employees}
  filterable
  filterMode="ColumnFilterRow"
  multiSelection
  groupable
  onCommittedItemChanges={saveEmployee}
/>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
