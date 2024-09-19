import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
const LoginPage = () => {
  const auth=useContext(AuthContext)
  if(!auth)throw new Error("AuthContext must be used within AuthProvider");
  return (
    <div>
        <form onSubmit={auth.loginUser}>
          <input type="text" name="username" placeholder="Enter Username" />
          <input type="password" name="password" placeholder="Enter Password" />
          <input type="submit" />
        </form>
    </div>
  )
}

export default LoginPage