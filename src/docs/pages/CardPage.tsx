import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { cardProps, cardParts } from '../apiReference'
import Button from '../../components/Button'
import Card from '../../components/Card'

type PageProps = { activePage: string }

export default function CardPage({ activePage }: PageProps) {
  const [cardClicks, setCardClicks] = useState(0)
  return (
    <section className="component-entry" id="card" aria-labelledby="card-title" hidden={activePage !== "card"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Component / 04</p>
        <h2 id="card-title">Card</h2>
        <p>
          A theme-aware surface for grouping related content and actions.
          Use its composable sections to build a clear card hierarchy.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="card-preview-title">
          <div className="panel-heading">
            <h3 id="card-preview-title">Preview</h3>
            <span>Outlined / Header / Content / Actions</span>
          </div>
          <div className="card-preview">
            <Card outlined elevation={1}>
              <Card.Header
                avatar={<span aria-label="Ada Lovelace">AL</span>}
                title="Design systems"
                subtitle="Updated 2 hours ago"
                actionContent={<span className="card-header-mark" aria-hidden="true">•••</span>}
              />
              <Card.Content>
                A shared set of principles and components helps teams build
                consistent interfaces with less repetition.
              </Card.Content>
              <Card.Divider />
              <Card.Actions>
                <Button color="Primary" variant="Text" size="Small">
                  Open guide
                </Button>
                <Button color="Default" variant="Text" size="Small">
                  Save for later
                </Button>
              </Card.Actions>
            </Card>

            <Card
              outlined
              square
              color="Surface"
              clickable
              onClick={() => setCardClicks((count) => count + 1)}
            >
              <Card.Media src="/favicon.svg" alt="React atom mark" height={96} fit="Contain" />
              <Card.Content>
                <span className="card-demo-label">Interactive surface</span>
                <p className="card-demo-copy">
                  Click this card, or focus it and press Enter or Space.
                </p>
                <p className="button-preview__feedback" aria-live="polite">
                  Activated {cardClicks} {cardClicks === 1 ? "time" : "times"}.
                </p>
              </Card.Content>
            </Card>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="card-props-title">
          <div className="panel-heading">
            <h3 id="card-props-title">Properties</h3>
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
                <PropsTableRows rows={cardProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="card-parts-title">
          <div className="panel-heading">
            <h3 id="card-parts-title">Child components</h3>
            <span>Composition API</span>
          </div>
          <div className="props-table-wrap">
            <table className="props-table">
              <thead>
                <tr>
                  <th scope="col">Part</th>
                  <th scope="col">Properties</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {cardParts.map(([part, properties, description]) => (
                  <tr key={part}>
                    <th scope="row"><code>Card.{part}</code></th>
                    <td><code>{properties}</code></td>
                    <td>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="card-usage-title">
          <div className="panel-heading">
            <h3 id="card-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`<Card outlined elevation={1}>
  <Card.Header
    avatar={<Avatar>AL</Avatar>}
    title="Design systems"
    subtitle="Updated today"
    actionContent={<IconButton aria-label="More options" />}
  />
  <Card.Media
    src="/images/guide.png"
    alt="Design system overview"
    height={192}
    fit="Cover"
  />
  <Card.Content>
    Related details and supporting content.
  </Card.Content>
  <Card.Divider />
  <Card.Actions>
    <Button variant="Text">Open guide</Button>
  </Card.Actions>
</Card>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
