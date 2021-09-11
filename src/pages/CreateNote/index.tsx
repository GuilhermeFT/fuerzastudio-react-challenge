import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { Loader } from '../../components/Loader'
import { Navbar } from '../../components/Navbar'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import { Entry } from '../../interfaces/entry.interface'
import { Journal } from '../../interfaces/journal.interface'
import http from '../../services/api'

import styles from './styles.module.scss'

type CreateNoteParams = {
  journalId: string
}

export function CreateNote() {
  let updateIdQuery = useQuery().get('updateId') // Coleta da URL parametros desejados

  const history = useHistory()

  const { user, logout } = useAuth() // Hook de autenticação

  const { journalId } = useParams<CreateNoteParams>() // Coleta os parametros da página colocados na rota

  const [noteName, setNoteName] = useState('')
  const [content, setContent] = useState('')
  const [journal, setJournal] = useState<Journal>()

  // Responsável por buscar os dados do journal para conferir se o journal existe
  useEffect(() => {
    http.get(`/journals/${user.id}`).then((response: any) => {
      if (!response) {
        toast.error('error fetching journals on create note!')
        logout()
        return null
      }

      // Se updateIdQuery estiver com dados reais, iremos buscar os dados referente a esse entry e preenchê-los nos campos
      if (updateIdQuery) {
        http.get(`/journals/entries/${journalId}`).then((response: any) => {
          if (response) {
            const entry = (response.entries as Entry[]).filter(
              entry => entry.id === updateIdQuery
            )[0]

            setNoteName(entry.title)
            setContent(entry.content)
          } else {
            /* Caso não exista esse dado, setamos null à variável updateIdQuery
          para evitar uma requisição errada no submit do formulário */
            updateIdQuery = null
          }
        })
      }

      /* Caso exista, selecionamos o journal com o ID igual ao que está sendo passado pela Rota da aplicação colatada pelo useParams */
      setJournal(
        response.journals.filter(
          (journal: Journal) => journal.id === journalId
        )[0] || null
      )
    })
  }, [])

  // Função responsável validar a a criação ou edição de um novo note
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    // Verificação de campos do formulário
    if (noteName.trim() === '' || content.trim() === '') {
      if (noteName.trim() === '') {
        toast.warning('Name field is empty!')
      }

      if (content.trim() === '') {
        toast.warning('Content field is empty!')
      }
      return null
    }

    // Caso updateIdQuery seja null, iremos usar a rota de criação
    if (!updateIdQuery) {
      const response: any = await http.post(`/journals/entry/${journalId}`, {
        title: noteName,
        content: content
      })

      if (!response) {
        toast.error('error creating note!')
        return null
      }

      history.push(`/my-journals/${journalId}`)
    } else {
      // Caso updateIdQuery seja diferente de null, iremos usar a rota de atualização
      const response: any = await http.put(`/journals/entry/${updateIdQuery}`, {
        title: noteName,
        content: content
      })

      if (!response) {
        toast.error('error updating note!')
        return null
      }

      history.push(`/my-journals/${journalId}/${updateIdQuery}`)
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        {/* Exibe um Loader enquanto os dados do journal é buscado */}
        {journal === undefined ? (
          <Loader />
        ) : journal !== null ? (
          /* Caso o journal existir, exibimos os componentes de formulario para o usuário */
          <>
            <Navbar
              disableButton
              linkToBackButton={`/my-journals/${journal.id}`}
              linkText={journal.title}
            />
            <form onSubmit={handleOnSubmitForm}>
              <input
                type="text"
                placeholder="Enter note name"
                value={noteName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setNoteName(e.target.value)
                }}
              />
              <textarea
                placeholder="Write your note"
                value={content}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                  setContent(e.target.value)
                }}
              />
              <Button type="submit">Save note</Button>
            </form>
          </>
        ) : (
          /* Caso o journal não existir (journal == null), retornaremos para a listagem de journal do usuário */
          <Redirect to="/my-journals" />
        )}
      </main>
    </>
  )
}
