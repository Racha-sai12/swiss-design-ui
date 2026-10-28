import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { buttonProps } from '../apiReference'
import Button from '../../components/Button'

type PageProps = { activePage: string }

export default function ButtonPage({ activePage }: PageProps) {
  const [buttonClicks, setButtonClicks] = useState(0)
  return (
    <section className="component-entry" id="button" aria-labelledby="button-title" hidden={activePage !== "button"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Component / 03</p>
        <h2 id="button-title">Button</h2>
        <p>
          A reusable action control for submitting forms, navigating to
          a URL, or invoking a command. Use an anchor for navigation and
          a native button for actions.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="button-preview-title">
          <div className="panel-heading">
            <h3 id="button-preview-title">Preview</h3>
            <span>Variants / Actions</span>
          </div>
          <div className="button-preview">
            <Button
              color="Primary"
              variant="Filled"
              ripple
              startIcon="Add"
              onClick={() => setButtonClicks((count) => count + 1)}
            >
              Create item
            </Button>
            <Button color="Secondary" variant="Outlined">
              Secondary
            </Button>
            <Button color="Tertiary" variant="Text" endIcon="ArrowRight">
              Learn more
            </Button>
            <Button color="Primary" variant="Filled" disabled>
              Disabled
            </Button>
            <Button
              htmlTag="div"
              color="Primary"
              variant="Outlined"
              onClick={() => setButtonClicks((count) => count + 1)}
            >
              Keyboard action
            </Button>
            <Button href="#button" variant="Text" endIcon="ArrowRight">
              Documentation link
            </Button>
          </div>
          <p className="button-preview__feedback" aria-live="polite">
            Create action activated {buttonClicks} {buttonClicks === 1 ? "time" : "times"}.
          </p>
        </section>

        <section className="props-panel" aria-labelledby="button-props-title">
          <div className="panel-heading">
            <h3 id="button-props-title">Properties</h3>
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
                <PropsTableRows rows={buttonProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="button-usage-title">
          <div className="panel-heading">
            <h3 id="button-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`<Button
  color="Primary"
  variant="Filled"
  size="Medium"
  startIcon="Add"
  onClick={handleCreate}
>
  Create item
</Button>

<Button href="/settings" target="_blank">
  Open settings
</Button>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
