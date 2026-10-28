import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { numericFieldProps } from '../apiReference'
import NumericField from '../../components/NumericField'

type PageProps = { activePage: string }

export default function NumericFieldPage({ activePage }: PageProps) {
  const [amount, setAmount] = useState(12.5)
  return (
    <section className="component-section" id="numeric-field" aria-labelledby="numeric-field-title" hidden={activePage !== "numeric-field"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 09</p>
      <h2 id="numeric-field-title">NumericField</h2>
      <p>
        A numeric input framed by Field, with locale-aware formatting,
        range-checked stepping, keyboard support, and optional clearing.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="numeric-field-preview-title">
        <div className="panel-heading">
          <h3 id="numeric-field-preview-title">Preview</h3>
          <span>Interactive / Min 0 / Max 100</span>
        </div>
        <div className="numeric-field-demo">
          <NumericField
            label="Amount"
            value={amount}
            valueChanged={(nextValue) => setAmount(nextValue)}
            min={0}
            max={100}
            step={0.5}
            format="F1"
            clearable
            variant="Outlined"
            fullWidth
            helperText={`Current value: ${amount?.toFixed(1) ?? "empty"} — try typing, arrow keys, or the spin buttons.`}
          />
          <NumericField
            label="Whole number"
            defaultValue={42}
            min={0}
            max={999}
            pattern="[0-9]"
            clearable
            hideSpinButtons
            variant="Filled"
            fullWidth
            helperText="Digits only. This example uses internal state."
          />
          <NumericField
            label="Localized amount"
            defaultValue={1234.5}
            culture="de-DE"
            format="N2"
            hideSpinButtons
            variant="Outlined"
            fullWidth
            helperText="German number formatting: decimal comma and grouped thousands."
          />
        </div>
      </section>

      <section className="props-panel" aria-labelledby="numeric-field-props-title">
        <div className="panel-heading">
          <h3 id="numeric-field-props-title">Properties</h3>
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
              <PropsTableRows rows={numericFieldProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="numeric-field-usage-title">
        <div className="panel-heading">
          <h3 id="numeric-field-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`const [amount, setAmount] = useState(12.5)

<NumericField
  value={amount}
  valueChanged={setAmount}
  label="Amount"
  min={0}
  max={100}
  step={0.5}
  format="F1"
  clearable
  variant="Outlined"
/>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
