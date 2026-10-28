import PropsTableRows from '../PropsTableRows'
import { alertProps, alertSeverities, alertVariants } from '../apiReference'
import Alert from '../../components/Alert'

type PageProps = { activePage: string }

export default function AlertPage({ activePage }: PageProps) {
  return (
    <section className="component-section" hidden={activePage !== "alert"}>
      <div className="section-heading" id="alert">
        <p className="eyebrow">Component / 01</p>
        <h2 id="components-title">Alert</h2>
        <p>
          An embedded, static feedback message for contextual information
          within page content. It is not a floating overlay.
        </p>
      </div>

      <div className="component-documentation" hidden={activePage !== "alert"}>
        <section className="preview-panel" aria-labelledby="preview-title">
          <div className="panel-heading">
            <h3 id="preview-title">Preview</h3>
            <span>All severities / All variants</span>
          </div>
          <div className="alert-preview-grid">
            {alertVariants.map((variant) => (
              <section className="alert-preview-variant" key={variant} aria-label={`${variant} alerts`}>
                <h4>{variant}</h4>
                <div className="alert-preview-variant__items">
                  {alertSeverities.map(([severity, message]) => (
                    <Alert key={`${variant}-${severity}`} severity={severity} variant={variant}>
                      {message}
                    </Alert>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="props-panel" aria-labelledby="props-title">
          <div className="panel-heading">
            <h3 id="props-title">Properties</h3>
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
                <PropsTableRows rows={alertProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="usage-title">
          <div className="panel-heading">
            <h3 id="usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`<Alert
  severity="Warning"
  variant="Outlined"
  dense
  showCloseIcon
  onCloseIconClicked={() => setVisible(false)}
>
  Check the details before continuing.
</Alert>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
