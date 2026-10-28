import { useState, type CSSProperties } from 'react'
import type { ImageObjectFit } from '../styles/types.js'

export type { ImageObjectFit } from '../styles/types.js'

export type ImageProps = {
  src: string
  alt: string
  fallbackSrc?: string
  width?: number
  height?: number
  fluid?: boolean
  elevation?: number
  objectFit?: ImageObjectFit
  objectPosition?: CSSProperties['objectPosition']
  class?: string
  className?: string
  style?: CSSProperties
}

const objectFitValues: Record<ImageObjectFit, NonNullable<CSSProperties['objectFit']>> = {
  Fill: 'fill',
  Contain: 'contain',
  Cover: 'cover',
  None: 'none',
  ScaleDown: 'scale-down',
}

function safeDimension(value: number | undefined) {
  return value !== undefined && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : undefined
}

export default function Image({
  src,
  alt,
  fallbackSrc,
  width,
  height,
  fluid = false,
  elevation = 0,
  objectFit = 'Fill',
  objectPosition = 'center',
  class: classProp,
  className,
  style,
}: ImageProps) {
  const [fallbackForSrc, setFallbackForSrc] = useState<string | null>(null)
  const currentSrc = fallbackSrc && fallbackForSrc === src ? fallbackSrc : src
  const safeWidth = safeDimension(width)
  const safeHeight = safeDimension(height)
  const safeElevation = Number.isFinite(elevation)
    ? Math.max(0, Math.min(25, Math.trunc(elevation)))
    : 0

  const imageStyle: CSSProperties = {
    objectFit: objectFitValues[objectFit],
    objectPosition,
    maxWidth: fluid ? '100%' : undefined,
    width: fluid ? '100%' : safeWidth,
    height: fluid ? 'auto' : safeHeight,
    boxShadow: safeElevation === 0
      ? 'none'
      : `0 ${safeElevation}px ${safeElevation * 3}px rgb(28 25 23 / 18%)`,
    ...style,
  }
  const classes = ['image', fluid && 'image--fluid', classProp, className].filter(Boolean).join(' ')

  return (
    <img
      className={classes}
      src={currentSrc}
      alt={alt}
      width={safeWidth}
      height={safeHeight}
      style={imageStyle}
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc && fallbackForSrc !== src) {
          setFallbackForSrc(src)
        }
      }}
    />
  )
}
