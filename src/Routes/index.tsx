import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { CreateJournal } from '../pages/CreateJournal'
import { CreateNote } from '../pages/CreateNote'
import { JournalList } from '../pages/JournalList'
import { NoteContent } from '../pages/NoteContent'
import { NoteList } from '../pages/NoteList'
import { SignIn } from '../pages/SignIn'
import { SignUp } from '../pages/SignUp'
import PrivateRoute from './private.routes'

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={SignIn} />
        <Route path="/signup" component={SignUp} />

        {/* Rotas de Listagem de Diários e de Notas */}
        <PrivateRoute path="/my-journals" component={JournalList} />
        <PrivateRoute path="/:journalId/notes" component={NoteList} />

        {/* Rotas de visualização individual das Notas */}
        <PrivateRoute path="/:journalId/:noteId" component={NoteContent} />

        {/* Rotas de criação/edição */}
        <PrivateRoute path="/new/journal" component={CreateJournal} />
        <PrivateRoute path="/new/note" component={CreateNote} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
