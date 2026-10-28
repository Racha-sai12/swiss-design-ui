export type AlertVariant = 'Text' | 'Outlined' | 'Filled'
export type ContentAlignment = 'Start' | 'Center' | 'End'

export type AppBarColor = 'Primary' | 'Default' | 'Transparent'

export const ButtonColor = {
  Default: 'Default',
  Primary: 'Primary',
  Secondary: 'Secondary',
  Tertiary: 'Tertiary',
  Info: 'Info',
  Success: 'Success',
  Warning: 'Warning',
  Error: 'Error',
} as const
export type ButtonColor = (typeof ButtonColor)[keyof typeof ButtonColor]

export const ButtonVariant = {
  Text: 'Text',
  Filled: 'Filled',
  Outlined: 'Outlined',
} as const
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant]

export const ButtonSize = {
  Small: 'Small',
  Medium: 'Medium',
  Large: 'Large',
} as const
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize]

export const IconSize = {
  Small: 'Small',
  Medium: 'Medium',
  Large: 'Large',
} as const
export type IconSize = (typeof IconSize)[keyof typeof IconSize]

export type CardColor = 'Default' | 'Surface' | 'Primary'
export type MediaFit = 'Cover' | 'Contain'

export type ChipSize = 'Small' | 'Medium' | 'Large'
export type ChipVariant = 'Text' | 'Filled' | 'Outlined'
export type ChipColor =
  | 'Default'
  | 'Surface'
  | 'Primary'
  | 'Secondary'
  | 'Info'
  | 'Success'
  | 'Warning'
  | 'Error'

export type DialogMaxWidth = 'Small' | 'Medium' | 'Large'
export type DialogPosition =
  | 'Center'
  | 'Top'
  | 'Bottom'
  | 'TopLeft'
  | 'TopRight'
  | 'BottomLeft'
  | 'BottomRight'

export type FieldVariant = 'Text' | 'Filled' | 'Outlined'
export type FieldMargin = 'None' | 'Dense' | 'Normal'
export type FieldAdornment = 'None' | 'Start' | 'End'
export type FieldAdornmentColor =
  | 'Default'
  | 'Primary'
  | 'Secondary'
  | 'Tertiary'
  | 'Info'
  | 'Success'
  | 'Warning'
  | 'Error'
export type FieldIconSize = 'Small' | 'Medium' | 'Large'
export type FieldTypo =
  | 'Body1'
  | 'Body2'
  | 'Caption'
  | 'Subtitle1'
  | 'Subtitle2'
  | 'Overline'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'H6'

export type ImageObjectFit = 'Fill' | 'Contain' | 'Cover' | 'None' | 'ScaleDown'

export type RadioColor =
  | 'Default'
  | 'Primary'
  | 'Secondary'
  | 'Tertiary'
  | 'Info'
  | 'Success'
  | 'Warning'
  | 'Error'
export type RadioSize = 'Small' | 'Medium' | 'Large'
export type RadioPlacement = 'Right' | 'Left' | 'Top' | 'Bottom' | 'Start' | 'End'

export type SelectOrigin =
  | 'TopLeft'
  | 'TopCenter'
  | 'TopRight'
  | 'CenterLeft'
  | 'Center'
  | 'CenterRight'
  | 'BottomLeft'
  | 'BottomCenter'
  | 'BottomRight'

export type SwitchColor = 'Default' | 'Primary'
export type SwitchSize = 'Small' | 'Medium' | 'Large'
export type SwitchLabelPlacement = 'Start' | 'End' | 'Top' | 'Bottom'

export type DatePickerVariant = 'Inline' | 'Dialog' | 'Static'
