/* eslint-disable multiline-ternary */
import { createContext, ReactNode, useEffect, useState } from 'react'
import http from '../services/api'
import { AuthResponse } from '../services/mirage/routes/user'

type User = {
  id?: string
  username: string
  journalIds: string[] | null
}

interface AuthContextProviderProps {
  children: ReactNode
}

interface AuthContextData {
  user: User
  isAuthenticated: boolean
  authenticate: (username: string, password: string) => void
  addNewJournal: (journalId: string) => void
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('@Nocturnal:Token') !== null
  })

  const [user, setUser] = useState<User>(() => {
    return JSON.parse(sessionStorage.getItem('@Nocturnal:User') || 'null')
  })

  useEffect(() => {
    sessionStorage.setItem('@Nocturnal:User', JSON.stringify(user))
  }, [user])

  async function authenticate(
    username: string,
    password: string
  ): Promise<boolean> {
    const response: any = await http.post('/auth/login', {
      username,
      password
    })

    if (!response) {
      return false
    }

    const authenticatedUser = {
      id: (response as AuthResponse).user.id,
      username: (response as AuthResponse).user.username,
      journalIds: (response as AuthResponse).user.journalIds
    }

    setUser(authenticatedUser)

    sessionStorage.setItem('@Nocturnal:Token', (response as AuthResponse).token)

    setIsAuthenticated(true)
    return true
  }

  async function addNewJournal(journalId: string) {
    setUser(oldUser => ({
      id: oldUser.id,
      username: oldUser.username,
      journalIds: !oldUser.journalIds?.includes(journalId)
        ? oldUser.journalIds?.concat([journalId]) || [journalId]
        : oldUser.journalIds
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authenticate,
        addNewJournal
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
