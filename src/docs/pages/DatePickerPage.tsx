import { useState } from 'react'
import PropsTableRows from '../PropsTableRows'
import { datePickerProps } from '../apiReference'
import DatePicker from '../../components/DatePicker'

type PageProps = { activePage: string }

export default function DatePickerPage({ activePage }: PageProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null)
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState<Date | null>(null)
  const [datePickerStatus, setDatePickerStatus] = useState("Calendar is closed.")
  const [demoDateLimits] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return {
      today,
      twoMonthsEnd: new Date(today.getFullYear(), today.getMonth() + 2, 0),
      monthEnd: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    }
  })
  return (
    <section className="component-section" id="date-picker" aria-labelledby="date-picker-title" hidden={activePage !== "date-picker"}>
    <div className="section-heading">
      <p className="eyebrow">Component / 14</p>
      <h2 id="date-picker-title">DatePicker</h2>
      <p>
        Choose a date from a navigable calendar or type it directly, with localized formatting,
        date constraints, and inline, dialog, or static presentation.
      </p>
    </div>

    <div className="component-documentation">
      <section className="preview-panel" aria-labelledby="date-picker-preview-title">
        <div className="panel-heading">
          <h3 id="date-picker-preview-title">Preview</h3>
          <span>Interactive / Constrained dates</span>
        </div>
        <div className="date-picker-demo-grid">
          <DatePicker
            label="Start date"
            date={selectedStartDate}
            dateChanged={setSelectedStartDate}
            dateFormat="dd/MM/yyyy"
            culture="en-GB"
            minDate={demoDateLimits.today}
            maxDate={demoDateLimits.twoMonthsEnd}
            isDateDisabledFunc={(candidate) => candidate.getDay() === 0 || candidate.getDay() === 6}
            editable
            mask="dd/MM/yyyy"
            fullWidth
            helperText="Weekends are unavailable; choose a date within the next two months."
            pickerOpened={() => setDatePickerStatus("Calendar opened.")}
            pickerClosed={() => setDatePickerStatus("Calendar closed.")}
          />
          <DatePicker
            label="Appointment month"
            date={selectedAppointmentDate}
            dateChanged={setSelectedAppointmentDate}
            pickerVariant="Dialog"
            openTo="Month"
            dateFormat="MMM d, yyyy"
            culture="en-US"
            fixYear={demoDateLimits.today.getFullYear()}
            fixMonth={demoDateLimits.today.getMonth() + 1}
            autoClose
          />
          <DatePicker
            label="Fixed calendar"
            pickerVariant="Static"
            openTo="Date"
            disableToolbar
            minDate={demoDateLimits.today}
            maxDate={demoDateLimits.monthEnd}
          />
          <p className="date-picker-demo-status" aria-live="polite">{datePickerStatus}</p>
        </div>
      </section>

      <section className="props-panel" aria-labelledby="date-picker-props-title">
        <div className="panel-heading">
          <h3 id="date-picker-props-title">Properties</h3>
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
              <PropsTableRows rows={datePickerProps} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="usage-panel" aria-labelledby="date-picker-usage-title">
        <div className="panel-heading">
          <h3 id="date-picker-usage-title">Usage</h3>
          <span>React / TSX</span>
        </div>
        <pre><code>{`const [startDate, setStartDate] = useState(null)
            const minDate = new Date()

            <DatePicker
  date={startDate}
  dateChanged={setStartDate}
  label="Start date"
  dateFormat="dd/MM/yyyy"
  minDate={minDate}
  editable
/>`}</code></pre>
      </section>
    </div>
    </section>
  )
}
