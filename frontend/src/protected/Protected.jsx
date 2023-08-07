
import { Navigate } from 'react-router-dom'
const Protected = ({isAuth,children}) => {
  return isAuth? children : <Navigate to="/login" />
    
 
 
}

export default Protected
