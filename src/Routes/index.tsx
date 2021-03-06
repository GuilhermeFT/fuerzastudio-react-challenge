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
        {/* Rotas Públicas (não precisam de autenticação) */}
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" component={SignUp} />

        {/* Rotas Protegidas (precisam de Autenticação) */}
        {/* Rotas de criação/edição */}
        <PrivateRoute path="/new/journal" component={CreateJournal} />
        <PrivateRoute path="/new/note/:journalId" component={CreateNote} />

        {/* Rotas de Listagem de Diários */}
        <PrivateRoute exact path="/my-journals" component={JournalList} />

        {/* Rotas de Listagem de Notas */}
        <PrivateRoute
          exact
          component={NoteList}
          path="/my-journals/:journalId/"
        />

        {/* Rotas de visualização das Notas */}
        <PrivateRoute
          path="/my-journals/:journalId/:noteId"
          component={NoteContent}
        />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
