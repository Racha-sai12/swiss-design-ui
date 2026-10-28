import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { fieldProps } from '../apiReference'
import Field, { type FieldAdornment, type FieldVariant } from '../../components/Field'

type PageProps = { activePage: string }

const fieldVariants = ['Text', 'Filled', 'Outlined'] as const satisfies readonly FieldVariant[]

export default function FieldPage({ activePage }: PageProps) {
  const [fieldValues, setFieldValues] = useState<Record<FieldVariant, string>>({
    Text: 'Northstar redesign',
    Filled: 'Northstar redesign',
    Outlined: 'Northstar redesign',
  })
  const [underline, setUnderline] = useState(true)
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(false)
  const [adornment, setAdornment] = useState<FieldAdornment>('End')
  const [fieldAction, setFieldAction] = useState('Try editing a value or activating an adornment.')

  return (
    <section className="component-section" id="field" aria-labelledby="field-title" hidden={activePage !== "field"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 08</p>
      <h2 id="field-title">Field</h2>
      <p>
        A form-styled frame for custom and read-only content, with floating
        labels, adornments, helper guidance, and validation feedback.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="field-preview-title">
        <div className="panel-heading">
          <h3 id="field-preview-title">Preview</h3>
          <span>All variants / Interactive</span>
        </div>
        <div className="field-preview-controls" aria-label="Field preview options">
          <label>
            <input
              type="checkbox"
              checked={underline}
              onChange={(event) => setUnderline(event.target.checked)}
            />
            Underline
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            Disabled
          </label>
          <label>
            <input
              type="checkbox"
              checked={error}
              onChange={(event) => setError(event.target.checked)}
            />
            Error
          </label>
          <label>
            Adornment
            <select
              value={adornment}
              onChange={(event) => setAdornment(event.target.value as FieldAdornment)}
            >
              <option value="None">None</option>
              <option value="Start">Start</option>
              <option value="End">End</option>
            </select>
          </label>
        </div>
        <p className="field-preview-feedback" aria-live="polite">{fieldAction}</p>
        <div className="field-demo-grid">
          {fieldVariants.map((variant) => (
            <section className="field-demo-variant" key={variant} aria-label={`${variant} field variant`}>
              <h4>{variant}</h4>
              <Field
                label={`${variant} field`}
                variant={variant}
                fullWidth
                underline={underline}
                disabled={disabled}
                error={error}
                errorText="Check this value before continuing."
                helperText={error ? undefined : 'Type here, or activate the search adornment.'}
                adornment={adornment}
                adornmentIcon="Search"
                adornmentAriaLabel={`Search from ${variant} field`}
                onAdornmentClick={() => setFieldAction(`${variant} field adornment activated.`)}
              >
                <input
                  aria-label={`${variant} field value`}
                  value={fieldValues[variant]}
                  onChange={(event) => setFieldValues((current) => ({
                    ...current,
                    [variant]: event.target.value,
                  }))}
                />
              </Field>
            </section>
          ))}
        </div>
      </section>

      <section className="props-panel" aria-labelledby="field-props-title">
        <div className="panel-heading">
          <h3 id="field-props-title">Properties</h3>
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
              <PropsTableRows rows={fieldProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="field-usage-title">
        <div className="panel-heading">
          <h3 id="field-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`<Field
  label="Project name"
  variant="Outlined"
  helperText="Shown in the project header."
  adornment="End"
  adornmentIcon="Search"
  adornmentAriaLabel="Search projects"
  onAdornmentClick={searchProjects}
>
  <span>Northstar redesign</span>
</Field>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
