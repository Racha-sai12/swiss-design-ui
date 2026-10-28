import PropsTableRows from '../PropsTableRows'
import { appBarProps } from '../apiReference'
import AppBar from '../../components/AppBar'

type PageProps = { activePage: string }

export default function AppBarPage({ activePage }: PageProps) {

  return (
    <section className="component-entry" id="app-bar" aria-labelledby="app-bar-title" hidden={activePage !== "app-bar"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Component / 02</p>
        <h2 id="app-bar-title">AppBar</h2>
        <p>
          A top-level application bar for branding, navigation, and user
          actions. It supports fixed or in-flow placement and theme-aware
          surfaces.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="app-bar-preview-title">
          <div className="panel-heading">
            <h3 id="app-bar-preview-title">Preview</h3>
            <span>Default / Elevation 1</span>
          </div>
          <div className="app-bar-preview">
            <AppBar elevation={1}>
              <a className="app-bar-brand" href="#components">R/DP</a>
              <nav className="app-bar-links" aria-label="Example application navigation">
                <a href="#alert">Alerts</a>
                <a href="#app-bar">App bars</a>
              </nav>
              <span className="app-bar-user">Account</span>
            </AppBar>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="app-bar-props-title">
          <div className="panel-heading">
            <h3 id="app-bar-props-title">Properties</h3>
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
                <PropsTableRows rows={appBarProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="app-bar-usage-title">
          <div className="panel-heading">
            <h3 id="app-bar-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`<AppBar
  color="Default"
  elevation={1}
  contextual
  actions={<AccountMenu />}
  contextualActions={<PageActions />}
>
  <Brand />
  <PrimaryNavigation />
</AppBar>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
