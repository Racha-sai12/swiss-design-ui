import styles from './styles/library.css?inline'

const styleElementId = 'swiss-design-ui-styles'

if (typeof document !== 'undefined' && !document.getElementById(styleElementId)) {
  const styleElement = document.createElement('style')
  styleElement.id = styleElementId
  styleElement.textContent = styles
  document.head.append(styleElement)
}

export * from './index'
