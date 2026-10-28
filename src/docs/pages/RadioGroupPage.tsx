import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { radioGroupProps, radioProps } from '../apiReference'
import { Radio, RadioGroup } from '../../components/RadioGroup'

type PageProps = { activePage: string }

export default function RadioGroupPage({ activePage }: PageProps) {
  const [deliveryPlan, setDeliveryPlan] = useState("standard")
  const [radioError, setRadioError] = useState(true)
  return (
    <section className="component-section" id="radio-group" aria-labelledby="radio-group-title" hidden={activePage !== "radio-group"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 10</p>
      <h2 id="radio-group-title">RadioGroup &amp; Radio</h2>
      <p>
        Mutually exclusive options with controlled or internal selection,
        group-level validation, theme colors, and flexible label placement.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="radio-preview-title">
        <div className="panel-heading">
          <h3 id="radio-preview-title">Preview</h3>
          <span>Interactive / Controlled selection</span>
        </div>
        <div className="radio-demo-grid">
          <RadioGroup
            label="Delivery method"
            name="delivery-method"
            value={deliveryPlan}
            valueChanged={setDeliveryPlan}
            color="Primary"
            unCheckedColor="Secondary"
            size="Medium"
            required
          >
            <Radio value="standard">Standard · Free</Radio>
            <Radio value="express" color="Info">Express · $8</Radio>
            <Radio value="pickup" disabled>Store pickup · Unavailable</Radio>
          </RadioGroup>
          <p className="radio-demo-feedback">
            Selected delivery: <strong>{deliveryPlan}</strong>
          </p>
          <RadioGroup
            label="Required selection"
            name="required-example"
            required
            error={radioError}
            errorText="Choose one option to continue."
            defaultValue={null}
            valueChanged={() => setRadioError(false)}
          >
            <Radio value="yes" size="Small">Yes</Radio>
            <Radio value="no" size="Small">No</Radio>
          </RadioGroup>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="radio-group-props-title">
        <div className="panel-heading">
          <h3 id="radio-group-props-title">RadioGroup properties</h3>
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
              <PropsTableRows rows={radioGroupProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="radio-props-title">
        <div className="panel-heading">
          <h3 id="radio-props-title">Radio properties</h3>
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
              <PropsTableRows rows={radioProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="radio-usage-title">
        <div className="panel-heading">
          <h3 id="radio-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`const [delivery, setDelivery] = useState("standard")

<RadioGroup
  label="Delivery method"
  name="delivery"
  value={delivery}
  valueChanged={setDelivery}
  required
>
  <Radio value="standard">Standard</Radio>
  <Radio value="express">Express</Radio>
</RadioGroup>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
