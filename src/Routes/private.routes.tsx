import { Redirect, Route, RouteProps } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/* Função semelhante a um Route do React-router responsável por entregar um componente Route protegido, ou seja, que precisa de um usuário autenticado para ser acesado */

function PrivateRoute({ ...rest }: RouteProps) {
  const { isAuthenticated } = useAuth()

  // Caso não tenha um login efetuado, o usuário é redirecionado para a página de Login
  return isAuthenticated ? <Route {...rest} /> : <Redirect to="/login" />
}

export default PrivateRoute
