import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { chipProps, chipSetProps } from '../apiReference'
import Chip, { ChipSet } from '../../components/Chip'

type PageProps = { activePage: string }

export default function ChipPage({ activePage }: PageProps) {
  const [singleChipValue, setSingleChipValue] = useState("design")
  const [multiChipValues, setMultiChipValues] = useState(["react"])
  return (
    <section className="component-entry" id="chip-and-chip-set" aria-labelledby="chip-title" hidden={activePage !== "chip-and-chip-set"}>
      <div className="section-heading component-entry__heading">
        <p className="eyebrow">Components / 05–06</p>
        <h2 id="chip-title">Chip &amp; ChipSet</h2>
        <p>
          Compact controls for entering information, choosing options,
          filtering results, and triggering small actions. ChipSet
          provides shared selection and visual defaults.
        </p>
      </div>

      <div className="component-documentation">
        <section className="preview-panel" aria-labelledby="chips-preview-title">
          <div className="panel-heading">
            <h3 id="chips-preview-title">Preview</h3>
            <span>Selection / Filtering / Removal</span>
          </div>
          <div className="chip-demo-group">
            <p className="chip-demo-label">Single selection</p>
            <ChipSet
              selectionMode="SingleSelection"
              selectedValue={singleChipValue}
              onSelectedValueChanged={(value) => setSingleChipValue(value)}
              selectedColor="Primary"
              checkedIcon="Check"
            >
              <Chip value="design" text="Design" />
              <Chip value="development" text="Development" />
              <Chip value="research" text="Research" />
            </ChipSet>
          </div>
          <div className="chip-demo-group">
            <p className="chip-demo-label">Multi-selection with removable chips</p>
            <ChipSet
              selectionMode="MultiSelection"
              selectedValues={multiChipValues}
              onSelectedValuesChanged={(values) => setMultiChipValues([...values])}
              color="Surface"
              selectedColor="Primary"
              allClosable
              onClose={(value) => setMultiChipValues((values) => values.filter((item) => item !== value))}
            >
              <Chip value="react" text="React" defaultSelected />
              <Chip value="typescript" text="TypeScript" defaultSelected />
              <Chip value="accessibility" text="Accessibility" />
              <Chip value="performance" text="Performance" />
            </ChipSet>
          </div>
          <div className="chip-demo-group">
            <p className="chip-demo-label">Toggle selection</p>
            <ChipSet selectionMode="ToggleSelection" color="Default">
              <Chip value="compact" text="Compact" defaultSelected />
              <Chip value="comfortable" text="Comfortable" />
            </ChipSet>
          </div>
          <div className="chip-demo-group">
            <p className="chip-demo-label">Content and states</p>
            <ChipSet size="Small" ripple>
              <Chip icon="Star" text="Featured" color="Primary" />
              <Chip avatarContent={<span>JD</span>}>Jordan Doe</Chip>
              <Chip text="Disabled" disabled />
              <Chip href="#card" text="Linked chip" target="_self" />
            </ChipSet>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="chip-props-title">
          <div className="panel-heading">
            <h3 id="chip-props-title">Chip properties</h3>
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
                <PropsTableRows rows={chipProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="props-panel" aria-labelledby="chip-set-props-title">
          <div className="panel-heading">
            <h3 id="chip-set-props-title">ChipSet properties</h3>
            <span>Shared defaults / Selection API</span>
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
                <PropsTableRows rows={chipSetProps} />
              </tbody>
            </table>
          </div>
        </section>

        <section className="usage-panel" aria-labelledby="chips-usage-title">
          <div className="panel-heading">
            <h3 id="chips-usage-title">Usage</h3>
            <span>React / TSX</span>
          </div>
          <pre><code>{`<ChipSet
  selectionMode="MultiSelection"
  selectedValues={selectedValues}
  onSelectedValuesChanged={setSelectedValues}
  selectedColor="Primary"
>
  <Chip value="react" text="React" defaultSelected />
  <Chip value="design" text="Design" icon="Star" />
</ChipSet>`}</code></pre>
        </section>
      </div>
    </section>
  )
}
