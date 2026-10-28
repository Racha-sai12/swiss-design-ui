import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { dialogProps, dialogOptionsProps, dialogServiceProps } from '../apiReference'
import Button from '../../components/Button'
import { Dialog, useDialogInstance, useDialogService } from '../../components/Dialog'

type PageProps = { activePage: string }

export default function DialogPage({ activePage }: PageProps) {
  const [inlineDialogVisible, setInlineDialogVisible] = useState(false)
  const [dialogResult, setDialogResult] = useState("No service dialog opened yet.")
  const { showAsync } = useDialogService()
  const openConfirmationDialog = async () => {
    const reference = showAsync(DialogConfirmation, {
      title: "Confirm action",
      parameters: { message: "The service opens this dialog and returns its result." },
      options: { closeButton: true, closeOnEscapeKey: true, maxWidth: "Small" },
    })
    const result = await reference.result
    const accepted =
      result.data !== null &&
      typeof result.data === 'object' &&
      'accepted' in result.data
        ? result.data.accepted
        : undefined
    setDialogResult(
      result.canceled
        ? "The service dialog was canceled."
        : `The service dialog returned accepted: ${String(accepted)}.`,
    )
  }
  return (
    <section className="component-entry" id="dialog" aria-labelledby="dialog-title" hidden={activePage !== "dialog"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Component / 06</p>
        <h2 id="dialog-title">Dialog</h2>
        <p>
          A modal surface for information, decisions, and tasks. Open it
          with the dialog service or control an inline instance with
          <code>isVisible</code>.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="dialog-preview-title">
          <div className="panel-heading">
            <h3 id="dialog-preview-title">Preview</h3>
            <span>Service / Inline</span>
          </div>
          <div className="dialog-demo-launchers">
            <Button variant="Filled" onClick={openConfirmationDialog}>
              Open service dialog
            </Button>
            <Button
              variant="Outlined"
              onClick={() => setInlineDialogVisible(true)}
            >
              Open inline dialog
            </Button>
          </div>
          <p className="dialog-demo-result" aria-live="polite">{dialogResult}</p>
          <Dialog
            titleContent={<span>Inline dialog</span>}
            dialogContent={<p>This instance is controlled by the page’s visibility state.</p>}
            dialogActions={
              <>
                <Button
                  variant="Text"
                  onClick={() => setInlineDialogVisible(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="Filled"
                  onClick={() => setInlineDialogVisible(false)}
                >
                  Done
                </Button>
              </>
            }
            defaultFocus="Dialog"
            isVisible={inlineDialogVisible}
            onIsVisibleChanged={setInlineDialogVisible}
            options={{ closeButton: true, closeOnEscapeKey: true, maxWidth: "Small" }}
          />
        </section>

        <section className="props-panel" aria-labelledby="dialog-props-title">
          <div className="panel-heading">
            <h3 id="dialog-props-title">Component properties</h3>
            <span>Inline / Template API</span>
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
                <PropsTableRows rows={dialogProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="dialog-options-title">
          <div className="panel-heading">
            <h3 id="dialog-options-title">DialogOptions</h3>
            <span>Configuration record</span>
          </div>
          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th scope="col">Option</th>
                  <th scope="col">Type</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <PropsTableRows rows={dialogOptionsProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="dialog-service-title">
          <div className="panel-heading">
            <h3 id="dialog-service-title">Service &amp; instance</h3>
            <span>Programmatic API</span>
          </div>
          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th scope="col">API</th>
                  <th scope="col">Type</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <PropsTableRows rows={dialogServiceProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="dialog-usage-title">
          <div className="panel-heading">
            <h3 id="dialog-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`const dialog = useDialogService()
const reference = dialog.showAsync(ConfirmDialog, {
  title: "Confirm action",
  parameters: { itemName: "draft" },
  options: { closeOnEscapeKey: true, maxWidth: "Small" },
})
const result = await reference.result

<Dialog
  title="Inline dialog"
  isVisible={visible}
  onIsVisibleChanged={setVisible}
  options={{ closeButton: true }}
  dialogContent={<p>Dialog body</p>}
/>`}</code></pre>
        </section>
      </div>
    </section>
)
}

function DialogConfirmation({ message = "Continue with this action?" }: { message?: string }) {
const dialog = useDialogInstance()

return (
<div className="dialog-demo-content">
  <p>{message}</p>
  <div className="dialog-demo-actions">
    <Button variant="Outlined" onClick={() => dialog.cancel()}>
      Cancel
    </Button>
    <Button variant="Filled" onClick={() => dialog.close({ accepted: true })}>
      Continue
    </Button>
  </div>
</div>
  )
}
