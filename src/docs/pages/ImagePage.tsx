import PropsTableRows from '../PropsTableRows'
import { imageProps } from '../apiReference'
import Image from '../../components/Image'
import imageStudy from '../../assets/swiss-image-study.svg'

type PageProps = { activePage: string }

export default function ImagePage({ activePage }: PageProps) {

  return (
    <section className="component-section" id="image" aria-labelledby="image-title" hidden={activePage !== "image"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 13</p>
      <h2 id="image-title">Image</h2>
      <p>
        A presentational image with fluid sizing, crop control, accessible alternative text,
        fallback handling, and theme-aware elevation.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="image-preview-title">
        <div className="panel-heading">
          <h3 id="image-preview-title">Preview</h3>
          <span>Fluid / Fixed crop</span>
        </div>
        <div className="image-demo-grid">
          <figure className="image-demo-figure">
            <Image
              src={imageStudy}
              alt="Swiss-style geometric study with charcoal shapes, a stone field, and a red diagonal."
              fallbackSrc="/icons.svg"
              width={960}
              height={540}
              fluid
              elevation={2}
              objectFit="Cover"
              className="image-demo-fluid"
            />
            <figcaption>Fluid image · 960 × 540 source</figcaption>
          </figure>
          <figure className="image-demo-figure image-demo-figure--fixed">
            <Image
              src={imageStudy}
              alt="Cropped detail of a red diagonal over dark geometric forms."
              width={240}
              height={180}
              elevation={1}
              objectFit="Cover"
              objectPosition="right center"
              className="image-demo-fixed"
            />
            <figcaption>Fixed crop · object-position: right center</figcaption>
          </figure>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="image-props-title">
        <div className="panel-heading">
          <h3 id="image-props-title">Properties</h3>
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
              <PropsTableRows rows={imageProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="image-usage-title">
        <div className="panel-heading">
          <h3 id="image-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`<Image
  src="/images/architecture-study.jpg"
  alt="Geometric study of layered forms"
  fallbackSrc="/images/fallback.jpg"
  width={960}
  height={540}
  fluid
  elevation={2}
  objectFit="Cover"
  objectPosition="center"
/>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
