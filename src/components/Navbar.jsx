import React from 'react'
import {Link, useNavigate} from "react-router-dom";
import { Auth } from '../firebase-config';
import {useAuthState} from "react-firebase-hooks/auth";
import { signOut } from 'firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import "./nav.css"

const Navbar = () => {
  const [user] = useAuthState(Auth);
  const navigator = useNavigate();

  const logOut = async () => {
    await signOut(Auth);
    navigator("/");
  };

  return (
    <header>
      <h1 className="text-4xl font-bold text-center text-blue-500">AI Image Generator</h1>
      <div className='menu'>
        <Link className='link' to={"/"}>Home</Link>
        {user && (
          <Link className='link generate-button' to={"/generate"}>
          AI Image
            <div className="animated-icon"></div>
          </Link>
        )}
        {user ? (
          <div className='link'>
            <div className='d-flex'>
              <img className='logo' src={user.photoURL} alt={user.displayName} />
              <button onClick={logOut}><LogoutIcon /></button>
            </div>
          </div>
        ) : (
          <Link className='link' to="/login">Login</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar;