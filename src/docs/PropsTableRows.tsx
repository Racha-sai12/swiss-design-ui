type PropsTableRowsProps = {
  rows: readonly (readonly string[])[]
}

export default function PropsTableRows({ rows }: PropsTableRowsProps) {
  return rows.map(([property, type, defaultValue, description]) => (
    <tr key={property}>
      <th scope="row"><code>{property}</code></th>
      <td><code>{type}</code></td>
      <td><code>{defaultValue}</code></td>
      <td>{description}</td>
    </tr>
  ))
}
