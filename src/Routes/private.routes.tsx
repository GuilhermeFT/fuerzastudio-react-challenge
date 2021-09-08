import { Redirect, Route, RouteProps } from 'react-router'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute({ ...rest }: RouteProps) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Route {...rest} /> : <Redirect to="/login" />
}

export default PrivateRoute
