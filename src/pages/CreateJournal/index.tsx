import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/useAuth'
import { useQuery } from '../../hooks/useQuery'
import { Journal } from '../../interfaces/journal.interface'

import http from '../../services/api'

import styles from './styles.module.scss'

export function CreateJournal() {
  let updateIdQuery = useQuery().get('updateId') // Coleta da URL parametros desejados

  const history = useHistory()

  const { user, logout } = useAuth() // Hook de autenticação

  const [journalName, setJournalName] = useState('')

  // Responsável por buscar os dados do journal caso a variável updateIdQuery tenha algum valor
  useEffect(() => {
    if (updateIdQuery) {
      http.get(`/journals/${user.id}`).then((response: any) => {
        if (response) {
          const journal = (response.journals as Journal[]).filter(
            journal => journal.id === updateIdQuery
          )[0]

          setJournalName(journal.title)
        } else {
          /* Caso não exista esse dado, setamos null à variável updateIdQuery
          para evitar uma requisição errada no submit do formulário */
          updateIdQuery = null
        }
      })
    }
  }, [])

  // Função responsável validar a a criação ou edição de um novo journal
  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    // Verifica se o input JournalName está vazio
    if (journalName.trim() === '') {
      toast.warning('journal name field is empty!')
      return null
    }

    // Caso updateIdQuery seja null, iremos usar a rota de criação
    if (!updateIdQuery) {
      const response = await http.post('/journals', {
        userId: user.id,
        title: journalName
      })

      if (!response) {
        toast.error('Error on create journal!')
        logout()

        return null
      }

      history.push('/my-journals') // Volta para a listagem após concluir a requisição
    } else {
      // Caso updateIdQuery seja diferente de null, iremos usar a rota de atualização
      const response = await http.put(`/journals/${updateIdQuery}`, {
        userId: user.id,
        title: journalName
      })

      if (!response) {
        toast.error('Error on update journal!')

        return null
      }

      history.push('/my-journals') // Volta para a listagem após concluir a requisição
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div>
          <div />
          <div>
            <p>{journalName}</p>
          </div>
        </div>

        <form onSubmit={handleOnSubmitForm}>
          <input
            type="text"
            placeholder="insert journal name"
            value={journalName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setJournalName(e.target.value)
            }}
          />
          <Button type="submit">Save Journal</Button>
        </form>
      </main>
    </>
  )
}
