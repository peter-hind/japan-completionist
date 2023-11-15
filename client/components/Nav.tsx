import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import Profile from './Profile'
import React from 'react'

function Nav() {
  const { user, isAuthenticated } = useAuth0()
  return (
    <div className="nav-bar">
      <Profile />
      {user ? <LogoutButton /> : <LoginButton />}
    </div>
  )
}

export default Nav