import { ChangeEvent, FormEvent, useState } from 'react'
import { useParams } from 'react-router'
import { Header } from '../../components/Header'
import http from '../../services/api'

type CreateNoteParams = {
  journalId: string
}

export function CreateNote() {
  const { journalId } = useParams<CreateNoteParams>()
  const [noteName, setNoteName] = useState('')
  const [content, setContent] = useState('')

  async function handleOnSubmitForm(e: FormEvent) {
    e.preventDefault()

    const response: any = await http.post(`/journals/entry/${journalId}`, {
      title: noteName,
      content: content
    })

    if (!response) {
      return null
    }

    console.log(response)
  }

  return (
    <>
      <Header />
      <main>
        <div>name</div>
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
          <button type="submit">Save note</button>
        </form>
      </main>
    </>
  )
}
