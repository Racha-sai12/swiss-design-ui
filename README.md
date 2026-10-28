# Swiss Design UI

A React component library with a Vite-powered documentation playground.

## Install

```sh
npm install swiss-design-ui
```

React and React DOM 19 are peer dependencies and should be installed in the
consuming application.

## Use

Import the components you need. The component styles are injected automatically
when the library entry point is imported:

```tsx
import {
  ButtonColor,
  ButtonVariant,
  Button,
  Field,
} from 'swiss-design-ui'

export function Example() {
  return (
    <>
      <Button
        color={ButtonColor.Info}
        variant={ButtonVariant.Outlined}
        endIcon="ArrowRight"
      >
        Save
      </Button>
      <Field label="Name">
        <input aria-label="Name" />
      </Field>
    </>
  )
}
```

`ButtonColor`, `ButtonVariant`, `ButtonSize`, and `IconSize` are exported
constant objects with matching TypeScript types. Their string values remain
supported, so existing JSX such as `variant="Outlined"` continues to work.

Theme colors use CSS custom properties; set `data-theme="dark"` or
`data-theme="light"` on the root element to select a theme. The library does
not install a theme provider or modify document state.

`DialogProvider` is needed when using `useDialogService`. Render it around the
part of the application that opens service-managed dialogs:

```tsx
import { DialogProvider } from 'swiss-design-ui'

<DialogProvider>
  <App />
</DialogProvider>
```

## Development

```sh
npm install
npm run dev
npm run build
npm run lint
```

`npm run build` creates the library package in `dist/` (ES modules, CommonJS,
embedded component styles, and TypeScript declarations) and the documentation
site in `docs-dist/`.
To preview the documentation build, run `npm run preview`.

## License

This project is licensed under the [MIT License](./LICENSE).

The package is configured as `swiss-design-ui@1.0.0`. Before publishing, check
that the package name is available on npm.
