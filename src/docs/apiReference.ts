export const buttonProps = [
  ["color", '"Default" | "Primary" | "Secondary" | "Tertiary" | "Info" | "Success" | "Warning" | "Error"', '"Default"', "Selects a theme color. Semantic colors use the single Swiss accent."],
  ["variant", '"Text" | "Filled" | "Outlined"', '"Text"', "Sets the button treatment."],
  ["size", '"Small" | "Medium" | "Large"', '"Medium"', "Sets the button dimensions and type size."],
  ["dense", "boolean", "false", "Reduces vertical padding."],
  ["disableElevation", "boolean", "false", "Removes the shadow, including when dropShadow is true."],
  ["dropShadow", "boolean", "false", "Adds a subtle shadow."],
  ["ripple", "boolean", "false", "Adds a centered click ripple; disabled when reduced motion is requested."],
  ["fullWidth", "boolean", "false", "Stretches the button to the width of its container."],
  ["customColor", "CSS color", "undefined", "Overrides the theme accent color."],
  ["label", "string", "undefined", "Text label, used when children are not provided."],
  ["children", "ReactNode", "undefined", "Button content; takes precedence over label."],
  ["startIcon / endIcon", "ReactNode | icon name", "undefined", "Optional icon content before or after the label. Built-in names: Add, ArrowRight, Check, Close, Search."],
  ["iconSize", '"Small" | "Medium" | "Large"', '"Medium"', "Sets the icon size."],
  ["ariaLabel", "string", "undefined", "Accessible name for icon-only buttons."],
  ["disabled", "boolean", "false", "Disables activation and marks the control disabled."],
  ["buttonType", '"button" | "submit" | "reset"', '"button"', "Sets the native button type. Applies when href is not provided and htmlTag is button."],
  ["htmlTag", '"button" | "div" | "span"', '"button"', "Chooses the non-link element. div and span receive button keyboard behavior."],
  ["href", "string", "undefined", "Renders an anchor instead of the selected htmlTag."],
  ["target", '"_self" | "_blank"', '"_self"', "Sets the anchor target; _blank automatically adds safe rel values."],
  ["onClick", "(event) => void", "undefined", "Called when an enabled button is activated; custom div/span tags also invoke it for Enter and Space."],
]

export const cardProps = [
  ["elevation", "number", "1", "Shadow depth in pixels; values are clamped from 0 to 24."],
  ["outlined", "boolean", "false", "Adds a theme-aware border alongside the elevation shadow."],
  ["square", "boolean", "false", "Removes the subtle corner rounding."],
  ["color", '"Default" | "Surface" | "Primary"', '"Default"', "Selects the default surface, a subdued surface, or the theme accent."],
  ["className", "string", "undefined", "Adds custom CSS classes to the card root."],
  ["style", "CSSProperties", "undefined", "Applies inline styles to the card root."],
  ["clickable", "boolean", "false", "Adds click affordance and keyboard activation. Do not use nested interactive controls in a clickable card."],
  ["href", "string", "undefined", "Renders the card as a link. Avoid nested links or buttons inside linked cards."],
  ["target", '"_self" | "_blank"', '"_self"', "Sets link target; _blank adds safe rel values."],
  ["onClick", "(event) => void", "undefined", "Callback for click, Enter, or Space activation."],
  ["children", "ReactNode", "Required", "Card sections and custom content."],
]

export const cardParts = [
  ["Header", "avatar, title, subtitle, actionContent, children", "Arranges an optional avatar, title/subtitle or custom header content, and a trailing action."],
  ["HeaderContent", "title, subtitle", "Renders the card title and supporting subtitle."],
  ["Media", "src, alt, height, fit", "Displays an image; fit is Cover or Contain, height is in pixels, and alt is required."],
  ["Content", "children", "Provides padded space for text, fields, or custom markup."],
  ["Divider", "—", "Renders a horizontal separator."],
  ["Actions", "children", "Groups action controls at the card footer."],
]

export const chipProps = [
  ["color", "ChipColor", '"Default"', "Base color used while unselected, unless SelectedColor overrides the selection appearance."],
  ["selectedColor", "ChipColor", '"Primary"', "Theme color applied while selected."],
  ["iconColor", "CSS color", "currentColor", "Overrides the leading or checked icon color."],
  ["variant", '"Text" | "Filled" | "Outlined"', '"Outlined"', "Selects the chip treatment."],
  ["size", '"Small" | "Medium" | "Large"', '"Medium"', "Sets chip dimensions and text size."],
  ["label", "boolean", "true", "Uses a pill-shaped theme border radius when true; square corners when false."],
  ["ripple", "boolean", "false", "Adds a click ripple, disabled for reduced-motion users."],
  ["text", "string", "undefined", "Fallback label; children take precedence."],
  ["children", "ReactNode", "undefined", "Custom chip content, taking precedence over text."],
  ["avatarContent", "ReactNode", "undefined", "Custom avatar content displayed before the icon and label."],
  ["icon / checkedIcon / closeIcon", "ReactNode | icon name", "undefined / Check / Close", "Leading icon, selected icon, and close control content. Built-in names: Add, Check, Close, Info, Star."],
  ["selected / defaultSelected", "boolean", "false", "Controlled or initial selection. defaultSelected also seeds an uncontrolled ChipSet."],
  ["ariaLabel", "string", "undefined", "Accessible name for icon-only or custom-markup chips."],
  ["disabled", "boolean", "false", "Disables this chip; ChipSet Disabled also disables all child chips."],
  ["value", "unknown", "undefined", "Selection identity in a ChipSet. Provide a value for selectable chips."],
  ["href / target / forceLoad", "string / target / boolean", "undefined / _self / false", "Renders a native link. _blank adds safe rel values; forceLoad explicitly requests full-page navigation."],
  ["onClick", "(event) => void", "undefined", "Called for an enabled selection or link activation."],
  ["onClose", "() => void", "undefined", "Shows a close control and runs when that control is clicked."],
  ["onSelectedChanged", "(selected: boolean) => void", "undefined", "Notifies when this chip requests a selection change."],
]

export const chipSetProps = [
  ["selectionMode", '"SingleSelection" | "MultiSelection" | "ToggleSelection"', '"SingleSelection"', "Selects one value, many values, or one value that can be toggled off."],
  ["selectedValue", "unknown", "undefined", "Controlled value for SingleSelection and ToggleSelection; provide onSelectedValueChanged to update it."],
  ["selectedValues", "readonly unknown[]", "undefined", "Controlled values for MultiSelection; provide onSelectedValuesChanged to update them."],
  ["comparer", "(left, right) => boolean", "Object.is", "Compares values when determining selection equality."],
  ["color / selectedColor / iconColor", "theme colors / CSS color", "Default / Primary / currentColor", "Inherited color defaults, overridable on each Chip."],
  ["size / label / ripple", "ChipSize / boolean / boolean", "Medium / true / false", "Inherited size, pill shape, and ripple defaults."],
  ["checkedIcon / closeIcon", "ReactNode | icon name", "Check / Close", "Inherited selected and close icons."],
  ["allClosable", "boolean", "false", "Enables a close control on every chip; chip values are used to remove chips from the set."],
  ["disabled", "boolean", "false", "Disables all child chips."],
  ["readOnly", "boolean", "false", "Prevents selection changes and link navigation."],
  ["onClose", "(value) => void", "undefined", "Called when any chip in the set is closed."],
  ["onSelectedValueChanged", "(value) => void", "undefined", "Selection change callback for single and toggle modes."],
  ["onSelectedValuesChanged", "(values) => void", "undefined", "Selection change callback for multi-selection mode."],
  ["children", "ReactNode", "Required", "Chip elements that inherit the set defaults."],
]

export const appBarProps = [
  ["bottom", "boolean", "false", "Places a fixed bar at the viewport bottom; in normal flow, pushes it to the end of a column layout."],
  ["fixed", "boolean", "false", "Pins the bar to the viewport. Set bottom to choose top or bottom placement."],
  ["contextual", "boolean", "false", "Uses contextualActions instead of actions when that slot is provided."],
  ["wrapContent", "boolean", "false", "Allows the bar and its content to wrap onto additional lines."],
  ["color", '"Primary" | "Default" | "Transparent"', '"Default"', "Selects the theme accent, surface, or transparent background."],
  ["elevation", "number", "0", "Sets shadow depth in pixels, capped at 24. Zero is flat."],
  ["dense", "boolean", "false", "Reduces the bar height from 72px to 56px."],
  ["gutters", "boolean", "true", "Adds responsive horizontal padding."],
  ["children", "ReactNode", "Required", "Branding and navigation content."],
  ["actions", "ReactNode", "undefined", "Default user actions rendered at the end of the bar."],
  ["contextualActions", "ReactNode", "undefined", "Page-specific actions used when contextual is true."],
]

export const alertProps = [
  ["severity", '"Info" | "Success" | "Warning" | "Error" | "Normal"', '"Normal"', "Sets the message label and symbol."],
  ["variant", '"Text" | "Outlined" | "Filled"', '"Text"', "Chooses the alert’s surface treatment."],
  ["dense", "boolean", "false", "Reduces vertical padding when true."],
  ["square", "boolean", "true", "Uses square corners when true; subtle rounding when false."],
  ["contentAlignment", '"Start" | "Center" | "End"', '"Start"', "Aligns the message text."],
  ["showCloseIcon", "boolean", "false", "Shows an accessible close button when true."],
  ["onCloseIconClicked", "() => void", "undefined", "Called when the close button is clicked."],
  ["children", "ReactNode", "Required", "The message content displayed in the alert."],
]

export const alertSeverities = [
  ["Info", "Useful information for the current context."],
  ["Success", "The requested action completed successfully."],
  ["Warning", "Review this information before continuing."],
  ["Error", "The action could not be completed."],
  ["Normal", "A neutral message for general information."],
] as const

export const alertVariants = ["Text", "Outlined", "Filled"] as const

export const dialogProps = [
  ["title / titleContent", "string / ReactNode", "undefined", "Title text or custom title content; titleContent takes precedence."],
  ["ariaLabel", "string", "undefined", "Accessible name fallback, particularly when the header is hidden or has no title."],
  ["dialogContent / children", "ReactNode", "undefined", "Main dialog content; dialogContent takes precedence over children."],
  ["dialogActions", "ReactNode", "undefined", "Optional footer action content."],
  ["defaultFocus", '"Element" | "Dialog" | "FirstFocusable"', '"Element"', "Chooses the initial focus target. Element prefers data-dialog-autofocus, then the first focusable control."],
  ["gutters", "boolean", "true", "Adds horizontal content padding."],
  ["options", "DialogOptions", "{}", "Sets backdrop, keyboard, header, sizing, placement, and backdrop-class behavior."],
  ["actionsClass", "string", "undefined", "Adds a class to the actions footer."],
  ["contentClass / contentStyle", "string / CSSProperties", "undefined", "Customizes the content container."],
  ["isVisible", "boolean", "false", "Controls visibility for inline dialogs."],
  ["onIsVisibleChanged", "(visible: boolean) => void", "undefined", "Reports inline visibility changes requested by backdrop, Escape, or close button."],
  ["onBackdropClick", "(event) => void", "undefined", "Replaces the default backdrop-close behavior. Available on inline dialogs and service configuration."],
  ["onKeyDown / onKeyUp", "(event) => void", "undefined", "Receives dialog keyboard events; available inline and through service configuration."],
]

export const dialogOptionsProps = [
  ["backdropClick", "boolean", "true", "Closes on an outside backdrop click, unless onBackdropClick is provided."],
  ["closeOnEscapeKey", "boolean", "false", "Closes on Escape when enabled."],
  ["closeButton", "boolean", "false", "Shows a close control in the header; closing returns a canceled result."],
  ["fullScreen", "boolean", "false", "Expands the dialog to fill the viewport."],
  ["fullWidth", "boolean", "false", "Uses the available viewport width."],
  ["maxWidth", '"Small" | "Medium" | "Large" | null', "null", "Caps the width at 400px, 560px, or 800px."],
  ["noHeader", "boolean", "false", "Hides the full header, including its close button."],
  ["position", '"Center" | "Top" | "Bottom" | "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight" | null', "null (Center)", "Sets the dialog placement within the viewport."],
  ["backgroundClass", "string", "undefined", "Adds a custom class to the backdrop."],
]

export const dialogServiceProps = [
  ["useDialogService().showAsync(Component, config)", "function", "—", "Opens a React component with optional title, typed parameters, and dialog options."],
  ["DialogReference.result", "Promise<DialogResult>", "—", "Resolves with canceled and optional data fields when the dialog closes."],
  ["DialogReference.close(value) / cancel()", "function", "—", "Closes with a custom value, a DialogResult, or a canceled result."],
  ["useDialogInstance().close(value) / cancel()", "function", "—", "Closes the current dialog from inside its content component; also accepts a DialogResult."],
  ["cancelAll()", "function", "—", "Cancels this dialog and all parent dialogs."],
  ["setOptionsAsync(options)", "Promise<void>", "—", "Updates the current dialog options while it is open."],
  ["setTitleAsync(title)", "Promise<void>", "—", "Changes the current dialog title while it is open."],
]

export const dataGridProps = [
  ["items / serverData / virtualizeServerData", "array / async function", "—", "Choose exactly one source: client-side records, paged server data, or scroll-loaded server data."],
  ["GridState / GridData<T>", "query state / { items, totalItems }", "—", "Server callbacks receive page, sorting, filtering, and grouping state; return the current items and total record count."],
  ["columns", "DataGridColumn<T>[]", "Required", "Column definitions provide key, title, and value; optionally set render, editor, update, footer, width, alignment, and sortable/filterable/groupable/hideable/resizable overrides."],
  ["sortMode / allowUnsorted", '"None" | "Single" | "Multiple" / boolean', '"Multiple" / false', "Choose sorting behavior; Shift-click adds secondary sorts and allowUnsorted adds a cleared state."],
  ["filterable / filterMode / quickFilter", "boolean / filter mode / (item) => boolean", "false / Simple / undefined", "Enable global text search, per-column filter menus or rows, and an additional record predicate."],
  ["multiSelection / selectedItem / selectedItems", "boolean / T / Set<T>", "false / undefined", "Use single or multiple selection, controlled with the matching change callback."],
  ["selectOnRowClick / comparer", "boolean / (left, right) => boolean", "true / Object.is", "Control row-click selection and record identity comparison."],
  ["readOnly / editMode / editTrigger", "boolean / Cell | Form / Manual | OnRowClick", "true / Cell / Manual", "Enable row editing; editable columns provide an editor or an update function."],
  ["canCancelEdit", "boolean", "true", "Allow an active edit to be canceled before it is committed."],
  ["groupable / groupExpanded / expandSingleRow", "boolean", "false / true / false", "Enable grouping, choose initial group expansion, and restrict nested-row expansion to one row."],
  ["hideable / resizable / showColumnOptions", "boolean", "false / false / true", "Configure grid-level column defaults and the columns visibility/order menu."],
  ["showFilterIcons / columnResizeMode", "boolean / Container | Column", "true / Column", "Show filter-menu toggles and choose the resize handle treatment."],
  ["dragDropColumnReordering / columnsPanelReordering", "boolean", "false", "Reorder columns by dragging headers or using controls in the columns panel."],
  ["virtualize / rowHeight / height", "boolean / number / CSS value", "false / 48 / undefined", "Virtualize client rows or load server rows while scrolling; virtualization requires a height."],
  ["fixedHeader / fixedFooter / horizontalScrollbar", "boolean", "false", "Stick table edges inside a height-constrained grid and enable horizontal overflow."],
  ["childRowContent / expandSingleRow", "(item) => ReactNode / boolean", "undefined / false", "Render expandable row details and optionally allow only one expanded row."],
  ["currentPage / rowsPerPage / pageSizeOptions", "number / number / number[]", "0 / 10 / [5, 10, 25, 50]", "Control pagination and available page sizes."],
  ["onCurrentPageChanged / onRowsPerPageChanged", "callbacks", "undefined", "Observe pagination changes."],
  ["onSelectedItemChanged / onSelectedItemsChanged", "callbacks", "undefined", "Observe single- or multi-selection changes."],
  ["dense / striped / hover / bordered / outlined / square", "boolean", "false", "Apply compact spacing, row treatments, and surface styles."],
  ["elevation / fixedHeader / fixedFooter / horizontalScrollbar", "number / boolean", "1 / false / false / false", "Set shadow depth, sticky table edges, and horizontal overflow behavior."],
  ["toolbarContent / pagerContent / noRecordsContent / loadingContent", "ReactNode", "undefined", "Replace the built-in toolbar, pager, empty state, or loading indicator."],
  ["onRowClick / onRowContextMenuClick", "callbacks", "undefined", "Handle row interaction events."],
  ["onStartedEditingItem / onCommittedItemChanges / onCanceledEditingItem", "callbacks", "undefined", "Observe the row editing lifecycle."],
  ["onFormFieldChanged", "(item, columnKey, value) => void", "undefined", "Observe each field update while a row is being edited."],
]

export const fieldProps = [
  ["variant", '"Text" | "Filled" | "Outlined"', '"Text"', "Chooses the field frame treatment."],
  ["margin", '"None" | "Dense" | "Normal"', '"None"', "Sets vertical spacing around the frame."],
  ["underline", "boolean", "true", "Shows the underline for Text and Filled variants."],
  ["innerPadding / fullWidth", "boolean", "false / false", "Adds padding around custom content or stretches the field to its container."],
  ["typo", '"Body1" | "Body2" | "Caption" | "Subtitle1" | "Subtitle2" | "Overline" | "H1"–"H6"', '"Body1"', "Applies a typography scale to field content."],
  ["shrinkLabel", "boolean", "false", "Keeps the label floated; labels also shrink while focused or when a child value is present."],
  ["adornment", '"None" | "Start" | "End"', '"None"', "Places an optional icon or text before or after the content."],
  ["adornmentIcon / adornmentText", "string / string", "undefined", "Uses a built-in or custom icon name; adornmentText takes precedence over the icon."],
  ["adornmentColor / iconSize", "FieldAdornmentColor / Small | Medium | Large", '"Default" / "Medium"', "Sets the adornment theme color and icon scale."],
  ["adornmentAriaLabel", "string", "undefined", "Provides an accessible name for a non-interactive adornment."],
  ["disabled", "boolean", "false", "Marks the frame disabled and makes wrapped controls inert."],
  ["error / errorText / helperText", "boolean / string / string", "false / undefined / undefined", "Shows validation feedback or helper guidance below the field."],
  ["label / children", "string / ReactNode", "undefined / Required", "Adds a floating label and the custom content to frame."],
  ["onAdornmentClick", "(event) => void", "undefined", "Makes the adornment a button and handles its activation."],
  ["id / className", "string", "generated / undefined", "Sets the field wrapper id or appends custom classes."],
]

export const numericFieldProps = [
  ["value / valueChanged / defaultValue", "number | null / callback / number | null", "undefined", "Control the numeric value and observe changes, or seed an uncontrolled field with defaultValue."],
  ["min / max / step", "number", "undefined / undefined / 1", "Bounds accepted values and sets the amount changed by spin buttons, wheel, and arrow keys."],
  ["hideSpinButtons", "boolean", "false", "Hides the increment and decrement controls."],
  ["invertMouseWheel", "boolean", "false", "Reverses the wheel increment direction while the input is focused."],
  ["clearable / clearIcon", "boolean / icon name", "false / Clear", "Shows a clear action when a value is present."],
  ["pattern", "regular expression", "undefined", "Restricts accepted input; character classes such as [0-9.] are checked per character."],
  ["immediate / debounceInterval", "boolean / milliseconds", "false / 0", "Update on each keystroke or after the configured delay; otherwise commit on blur or Enter."],
  ["format", "string", "undefined", "Supports .NET-like F1/F2 fixed, N1/N2 grouped, or custom grouping and decimal formats."],
  ["culture", "BCP 47 locale", "navigator.language", "Uses locale-specific decimal and grouping separators."],
  ["label / variant / margin / adornment", "Field properties", "Field defaults", "Inherits Field framing, layout, helper text, adornment properties, and onAdornmentClick."],
  ["disabled / readOnly / error / errorText / helperText", "boolean / strings", "false / false / false / undefined", "Inherits disabled state and validation presentation from Field."],
  ["id / name", "string", "generated / undefined", "Sets a stable input id and the form control name."],
]

export const radioGroupProps = [
  ["value / defaultValue / valueChanged", "T / T / (value: T) => void", "undefined", "Use a controlled value and callback or seed an uncontrolled group."],
  ["disabled / readOnly", "boolean", "false / false", "Disable all options, or keep them focusable while preventing changes."],
  ["name / label / children", "string / string / ReactNode", "generated / undefined / required", "Set the native radio name, accessible group label, and option content."],
  ["required", "boolean", "false", "Require one option for native form validation and expose aria-required."],
  ["error / errorText", "boolean / string", "false / undefined", "Expose the invalid state and show validation feedback."],
  ["color / unCheckedColor", "RadioColor", '"Primary" / "Default"', "Set the selected and unselected control colors for child options."],
  ["dense / size / placement", "boolean / Small | Medium | Large / placement", "false / Medium / Right", "Set option spacing, control size, and label placement."],
  ["disableRipple", "boolean", "false", "Disable the active ripple treatment for every option in the group."],
]

export const radioProps = [
  ["value", "T", "Required", "Value represented by this radio option."],
  ["children", "ReactNode", "Required", "Label text or custom option content."],
  ["color / unCheckedColor", "RadioColor", "group default", "Override selected or unselected color for this option."],
  ["dense / size / placement / disableRipple", "boolean / size / placement / boolean", "group defaults", "Override inherited option spacing, control size, label placement, or ripple behavior."],
  ["disabled", "boolean", "false", "Disable this option; the group disabled state disables all options."],
  ["id / className", "string", "generated / undefined", "Set a stable input id or append custom classes."],
]

export const selectProps = [
  ["value / defaultValue / valueChanged", "T | null / T | null / callback", "undefined / null / undefined", "Control single selection and observe changes, or seed an uncontrolled Select."],
  ["multiSelection", "boolean", "false", "Enables multi-selection and uses selectedValues instead of value."],
  ["selectedValues / selectedValuesChanged / defaultSelectedValues", "readonly T[] / callback / readonly T[]", "undefined / undefined / []", "Control or initialize the selected values in multi-selection mode."],
  ["delimiter / multiSelectionTextFunc", "string / (values: readonly T[]) => string", '", " / undefined', "Format the displayed labels for multiple selected items."],
  ["comparer", "(left: T, right: T) => boolean", "Object.is", "Compares option values for single and multi-selection."],
  ["anchorOrigin / transformOrigin", "SelectOrigin", '"BottomLeft" / "TopLeft"', "Position the popover relative to the field and its own transform point."],
  ["dense / maxHeight / lockScroll / fitContent", "boolean / number / boolean / boolean", "false / 300 / false / false", "Set compact option spacing, menu height, page scroll locking, and content-based menu width."],
  ["clearable / closeIcon / checkedIcon / indeterminateIcon", "boolean / icon / icon / icon", "false / Close / Check / Indeterminate", "Show a clear action and configure the menu selection and clear icons."],
  ["listClass / inputClass / name / id / className", "string", "undefined", "Add menu or trigger classes and set form, accessibility, and root identifiers."],
  ["label / variant / margin / adornment / helperText", "Field properties", "Field defaults", "Inherits Field framing, adornments, helper text, and visual variants."],
  ["disabled / readOnly / error / errorText", "boolean / strings", "false / false / false / undefined", "Disable interaction, prevent selection changes, or show validation feedback."],
  ["fullWidth / children / onAdornmentClick", "boolean / ReactNode / callback", "false / required / undefined", "Stretch the control, provide SelectItems, and handle an interactive adornment."],
]

export const selectItemProps = [
  ["value", "T", "Required", "Value represented by this option."],
  ["children", "ReactNode", "Required", "Visible option label or custom content."],
  ["disabled", "boolean", "false", "Prevents this option from being selected."],
]

export const switchProps = [
  ["value / valueChanged / defaultValue", "T / callback / T", "undefined / undefined / false", "Use a controlled or uncontrolled generic switch value."],
  ["checked / checkedChanged / defaultChecked", "T / callback / T", "undefined / undefined / false", "Alternative binding props; value takes precedence if both controlled props are set."],
  ["trueValue / falseValue", "T / T", "true / false", "Map the checked state to alternate generic values."],
  ["color / uncheckedColor / thumbIconColor", '"Default" | "Primary"', '"Default"', "Use neutral ink or the Swiss red accent for the checked track, unchecked track, or thumb icon."],
  ["thumbIcon", "string", "undefined", "Shows an optional icon or character inside the thumb. Built-in names: Check, Close, Minus, Star."],
  ["label / labelPlacement", "string / Start | End | Top | Bottom", "undefined / End", "Adds a label beside or above/below the control."],
  ["size / dense / ripple", "Small | Medium | Large / boolean / boolean", "Medium / false / true", "Sets the switch dimensions, compact spacing, and pressed ripple feedback."],
  ["disabled / readOnly", "boolean", "false / false", "Disable interaction or keep focus available without changing the state."],
  ["required / error / errorText", "boolean / boolean / string", "false / false / undefined", "Enforce native required form validation and show accessible validation feedback."],
  ["ariaLabel / name / id / className", "string", "undefined / undefined / generated / undefined", "Set an accessible name when no visible label exists and native form or styling identifiers."],
  ["onClick", "(event) => void", "undefined", "Observe a user click; use valueChanged or checkedChanged to respond to state changes."],
]

export const imageProps = [
  ["src", "string", "Required", "Primary image path or URL."],
  ["alt", "string", "Required", "Alternative text for meaningful images; use an empty string only for decorative images."],
  ["fallbackSrc", "string", "undefined", "Backup image used if the primary source fails. A failed fallback is not retried."],
  ["width / height", "number", "undefined", "Optional pixel dimensions. Invalid or negative values are normalized safely."],
  ["fluid", "boolean", "false", "Sets the image to fill available width while preserving its intrinsic ratio unless height is specified."],
  ["elevation", "number", "0", "Adds a theme-neutral shadow, clamped to the supported range of 0–25."],
  ["objectFit", '"Fill" | "Contain" | "Cover" | "None" | "ScaleDown"', '"Fill"', "Controls how the source fits within the rendered dimensions."],
  ["objectPosition", "CSSProperties['objectPosition']", '"center"', "Controls how the source is aligned inside its rendered box."],
  ["class / className", "string", "undefined", "Adds custom classes to the image element; both values are combined when provided."],
  ["style", "CSSProperties", "undefined", "Applies inline styles after the component’s sizing and elevation styles."],
]

export const datePickerProps = [
  ["date / defaultDate / dateChanged", "Date | null / Date | null / callback", "undefined / null / undefined", "Control the selected local date or initialize an uncontrolled picker."],
  ["minDate / maxDate", "Date | null", "undefined", "Restrict dates before the minimum or after the maximum, inclusive."],
  ["isDateDisabledFunc", "(date: Date) => boolean", "() => false", "Disable individual dates, such as weekends or unavailable appointments."],
  ["fixYear / fixMonth / fixDay", "number", "undefined", "Restrict selectable dates to a year, 1-based month (1–12), or day of month."],
  ["pickerVariant", '"Inline" | "Dialog" | "Static"', '"Inline"', "Show a popover calendar, centered modal calendar, or always-visible calendar."],
  ["openTo", '"Date" | "Month" | "Year"', '"Date"', "Choose the initial calendar view when the picker opens."],
  ["editable / autoClose / disableToolbar", "boolean", "false / true / false", "Allow direct formatted typing, close after selection, and hide the calendar toolbar."],
  ["dateFormat / culture / mask", "string / BCP 47 locale / string | function", '"MM/dd/yyyy" / navigator.language / undefined', "Format and parse common .NET date tokens using locale month names; mask may be a format template or transform function."],
  ["label / variant / margin / adornment / helperText", "Field properties", "Field defaults", "Inherits Field framing, appearance, adornments, and helper text."],
  ["disabled / readOnly / error / errorText", "boolean / strings", "false / false / false / undefined", "Disable interaction, allow calendar opening without typing, or display validation feedback."],
  ["fullWidth / name / id / className / style", "boolean / strings / CSSProperties", "false / undefined / generated / undefined / undefined", "Set layout, native form name, identifiers, classes, or root inline styles."],
  ["pickerOpened / pickerClosed", "() => void", "undefined", "Observe transitions into and out of Inline or Dialog calendar presentation."],
]
