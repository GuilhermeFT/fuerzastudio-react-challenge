/* eslint-disable multiline-ternary */
import { createContext, ReactNode, useState } from 'react'

import http from '../services/api'
import { AuthResponse } from '../services/mirage/routes/user'

// Tipagem de dados do usuário que será armazenados nos states e no sessionStorage
type User = {
  id?: string
  username: string
  journalIds: string[] | null
}

// Tipagem referente ao provider do nosso context, quais dados ele irá receber para renderizar em tela
interface AuthContextProviderProps {
  children: ReactNode
}

// Tipagem dos tipos de dados que o nosso Context irá fornecer para os seus filhos (childrens)
interface AuthContextData {
  user: User
  isAuthenticated: boolean
  authenticate: (username: string, password: string) => Promise<boolean>
  newAccount: (
    username: string,
    password: string,
    email?: string
  ) => Promise<boolean>
  logout: () => void
}

// Criação e exportação da AuthContext
export const AuthContext = createContext({} as AuthContextData)

// Criação e exportação do Provider da AuthContext
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // States referentes ao usuário e seu estado de autenticação

  // Esse estado é responsável por renderizar ou não certas páginas e conteúdos em toda a aplicação, pois ela informará qual o estado que o usuário se encontra
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Coleta dados da sessionStorage para verificar se o usuário esteve logado antes
    return sessionStorage.getItem('@Nocturnal:Token') !== null
  })

  // Responsável por facilitar a busca de dados referente ao usuário em qualquer parte da aplicação
  const [user, setUser] = useState<User>(() => {
    // Coleta dados da sessionStorage para verificar se o usuário esteve logado antes
    return JSON.parse(sessionStorage.getItem('@Nocturnal:User') || 'null')
  })

  // Função responsável por efetuar a autenticação do usuário
  async function authenticate(
    username: string,
    password: string
  ): Promise<boolean> {
    // Requisição com username e password
    const response: any = await http.post('/auth/login', {
      username,
      password
    })

    // Caso não exista, retornaremos false
    if (!response) {
      return false
    }

    // caso exista, salvaremos o usuário na sessionStorage e também no useState User

    const authenticatedUser = {
      id: (response as AuthResponse).user.id,
      username: (response as AuthResponse).user.username,
      journalIds: (response as AuthResponse).user.journalIds
    }

    setUser(authenticatedUser)

    sessionStorage.setItem('@Nocturnal:User', JSON.stringify(authenticatedUser))
    sessionStorage.setItem('@Nocturnal:Token', (response as AuthResponse).token)

    // Mudamos o estado para Mudarmos o comportamento da aplicação
    setIsAuthenticated(true)

    // Envia uma confirmação de que tudo deu certo
    return true
  }

  // Função responsável por criar um novo usuário
  async function newAccount(
    username: string,
    password: string,
    email?: string
  ) {
    // Requisição com username password e email (opicional)
    const response: any = await http.post('/auth/signup', {
      username,
      password,
      email
    })

    // Caso não ocorra com sucesso, retornaremos false
    if (!response) {
      return false
    }

    // Envia uma confirmação de que tudo deu certo
    return true
  }

  // Função responsável por efetuar o Logout do usuário
  function logout() {
    // Remove os dados da sessionStorage
    sessionStorage.removeItem('@Nocturnal:User')
    sessionStorage.removeItem('@Nocturnal:Token')

    // Mudamos o estado para mudarmos o comportamento da aplicação
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authenticate,
        newAccount,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
