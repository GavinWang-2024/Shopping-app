import React,{useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  const auth=useContext(AuthContext);
  if(!auth){
    return null;
  }
  return (
    <div>
        <Link to="/">Home</Link>
        <span> | </span>
        {auth.user ? (<p onClick={auth.logoutUser}>Logout</p>):<Link to="/login/">Login</Link>}
        {auth.user && <p>Hello {auth.user.username}</p>}
    </div>
  )
}

export default Header