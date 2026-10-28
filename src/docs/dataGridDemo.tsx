import type { DataGridColumn } from '../components/DataGrid'

export type Employee = {
  id: number
  name: string
  role: string
  team: string
  status: string
  salary: number
}

export const initialGridRows: Employee[] = [
  { id: 1, name: "Maya Chen", role: "Design", team: "Studio", status: "Active", salary: 92000 },
  { id: 2, name: "Noah Williams", role: "Engineer", team: "Platform", status: "Active", salary: 108000 },
  { id: 3, name: "Amara Okafor", role: "Research", team: "Studio", status: "Review", salary: 87000 },
  { id: 4, name: "Leo Martin", role: "Engineer", team: "Platform", status: "Active", salary: 101000 },
  { id: 5, name: "Sofia Alvarez", role: "Design", team: "Product", status: "Active", salary: 94000 },
  { id: 6, name: "Ethan Brooks", role: "Research", team: "Product", status: "Away", salary: 89000 },
  { id: 7, name: "Aisha Patel", role: "Engineer", team: "Platform", status: "Review", salary: 112000 },
  { id: 8, name: "Oliver Fischer", role: "Design", team: "Studio", status: "Active", salary: 90000 },
]

export const dataGridColumns: DataGridColumn<Employee>[] = [
  { key: "name", title: "Name", value: (row) => row.name, sortable: true, groupable: false },
  { key: "role", title: "Role", value: (row) => row.role, sortable: true },
  { key: "team", title: "Team", value: (row) => row.team, sortable: true, groupable: true },
  { key: "status", title: "Status", value: (row) => row.status, sortable: true },
  {
    key: "salary",
    title: "Salary",
    value: (row) => row.salary,
    sortable: true,
    align: "right",
    render: (row) => `$${row.salary.toLocaleString()}`,
    update: (row, value) => ({ ...row, salary: Number(value) }),
    editor: (value, onChange) => (
      <input
        aria-label="Edit salary"
        inputMode="numeric"
        value={String(value ?? "")}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    ),
  },
]
