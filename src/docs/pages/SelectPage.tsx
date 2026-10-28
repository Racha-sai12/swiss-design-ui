import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { selectProps, selectItemProps } from '../apiReference'
import Select, { SelectItem } from '../../components/Select'

type PageProps = { activePage: string }

export default function SelectPage({ activePage }: PageProps) {
  const [selectedCoffee, setSelectedCoffee] = useState("espresso")
  const [selectedFrameworks, setSelectedFrameworks] = useState(["react"])
  return (
    <section className="component-section" id="select" aria-labelledby="select-title" hidden={activePage !== "select"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 11</p>
      <h2 id="select-title">Select</h2>
      <p>
        A Field-framed dropdown with accessible keyboard navigation,
        controlled or internal state, custom option content, and multi-selection.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="select-preview-title">
        <div className="panel-heading">
          <h3 id="select-preview-title">Preview</h3>
          <span>Interactive / Single &amp; multiple selection</span>
        </div>
        <div className="select-demo-grid">
          <Select
            label="Coffee"
            value={selectedCoffee}
            valueChanged={setSelectedCoffee}
            clearable
            fullWidth
            helperText={`Selected coffee: ${selectedCoffee || "none"}`}
          >
            <SelectItem value="cappuccino">Cappuccino</SelectItem>
            <SelectItem value="espresso">Espresso</SelectItem>
            <SelectItem value="matcha" disabled>Matcha · Unavailable</SelectItem>
            <SelectItem value="flat-white">Flat white</SelectItem>
          </Select>
          <Select
            label="Technologies"
            multiSelection
            selectedValues={selectedFrameworks}
            selectedValuesChanged={setSelectedFrameworks}
            multiSelectionTextFunc={(values) => `${values.length} selected`}
            dense
            clearable
            fitContent
          >
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="vite">Vite</SelectItem>
            <SelectItem value="legacy" disabled>Legacy system · Unavailable</SelectItem>
          </Select>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="select-props-title">
        <div className="panel-heading">
          <h3 id="select-props-title">Select properties</h3>
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
              <PropsTableRows rows={selectProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="select-item-props-title">
        <div className="panel-heading">
          <h3 id="select-item-props-title">SelectItem properties</h3>
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
              <PropsTableRows rows={selectItemProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="select-usage-title">
        <div className="panel-heading">
          <h3 id="select-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`const [coffee, setCoffee] = useState("espresso")

<Select
  label="Coffee"
  value={coffee}
  valueChanged={setCoffee}
  clearable
>
  <SelectItem value="cappuccino">Cappuccino</SelectItem>
  <SelectItem value="espresso">Espresso</SelectItem>
</Select>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
