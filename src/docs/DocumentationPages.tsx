import AlertPage from './pages/AlertPage'
import AppBarPage from './pages/AppBarPage'
import ButtonPage from './pages/ButtonPage'
import CardPage from './pages/CardPage'
import ChipPage from './pages/ChipPage'
import DialogPage from './pages/DialogPage'
import DataGridPage from './pages/DataGridPage'
import FieldPage from './pages/FieldPage'
import NumericFieldPage from './pages/NumericFieldPage'
import RadioGroupPage from './pages/RadioGroupPage'
import SelectPage from './pages/SelectPage'
import SwitchPage from './pages/SwitchPage'
import ImagePage from './pages/ImagePage'
import DatePickerPage from './pages/DatePickerPage'


type DocumentationPagesProps = { activePage: string }

export default function DocumentationPages({ activePage }: DocumentationPagesProps) {
  return (
    <>
      
      <AlertPage activePage={activePage} />
      <AppBarPage activePage={activePage} />
      <ButtonPage activePage={activePage} />
      <CardPage activePage={activePage} />
      <ChipPage activePage={activePage} />
      <DialogPage activePage={activePage} />
      <DataGridPage activePage={activePage} />
      <FieldPage activePage={activePage} />
      <NumericFieldPage activePage={activePage} />
      <RadioGroupPage activePage={activePage} />
      <SelectPage activePage={activePage} />
      <SwitchPage activePage={activePage} />
      <ImagePage activePage={activePage} />
      <DatePickerPage activePage={activePage} />
    </>
  )
}
