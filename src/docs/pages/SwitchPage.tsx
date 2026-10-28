import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { switchProps } from '../apiReference'
import Switch from '../../components/Switch'

type PageProps = { activePage: string }

export default function SwitchPage({ activePage }: PageProps) {
  const [switchValue, setSwitchValue] = useState(true)
  const [switchRequired, setSwitchRequired] = useState(false)
  const [switchError, setSwitchError] = useState(true)
  const [switchClickCount, setSwitchClickCount] = useState(0)
  return (
    <section className="component-section" id="switch" aria-labelledby="switch-title" hidden={activePage !== "switch"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 12</p>
      <h2 id="switch-title">Switch</h2>
      <p>
        A binary control with generic values, accessible keyboard operation,
        native required validation, and a restrained neutral-and-red palette.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="switch-preview-title">
        <div className="panel-heading">
          <h3 id="switch-preview-title">Preview</h3>
          <span>Interactive / Controlled state</span>
        </div>
        <div className="switch-demo-grid">
          <div className="switch-demo-stack">
            <Switch
              label="Email notifications"
              value={switchValue}
              valueChanged={setSwitchValue}
              color="Primary"
              thumbIcon={switchValue ? "Check" : undefined}
              name="emailNotifications"
              onClick={() => setSwitchClickCount((count) => count + 1)}
            />
            <p className="switch-demo-feedback">
              Notifications are <strong>{switchValue ? "on" : "off"}</strong>.
              Clicks observed: <strong>{switchClickCount}</strong>
            </p>
          </div>
          <div className="switch-demo-stack">
            <Switch
              label="Accept terms"
              value={switchRequired}
              valueChanged={(nextValue) => {
                setSwitchRequired(nextValue)
                if (nextValue) setSwitchError(false)
              }}
              required
              error={switchError}
              errorText="This choice is required to continue."
              labelPlacement="Start"
              color="Primary"
            />
            <Switch label="Read-only state" checked readOnly />
            <Switch label="Disabled state" disabled />
            <Switch label="Compact, large thumb" size="Large" dense defaultChecked ripple={false} />
          </div>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="switch-props-title">
        <div className="panel-heading">
          <h3 id="switch-props-title">Properties</h3>
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
              <PropsTableRows rows={switchProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="switch-usage-title">
        <div className="panel-heading">
          <h3 id="switch-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`const [enabled, setEnabled] = useState(true)

<Switch
  label="Email notifications"
  value={enabled}
  valueChanged={setEnabled}
  color="Primary"
  required
/>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
