import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase/firebase'
import Hero from '../../components/Landing/Hero'
import AuthModal from '../../components/Modals/AuthModal'
import Login from '../../components/Auth/Login'
import Register from '../../components/Auth/Register'

const Landing = () => {

  //* Login in States
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [showLogInModal, setShowLogInModal] = React.useState(false)

  //* Register States
  const [showRegisterModal, setShowRegisterModal] = React.useState(false)

  //* Other States
  const navigate = useNavigate()

  //* Auth useEffect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setIsLoggedIn(true)
        navigate('/home')
      }else {
        setIsLoggedIn(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  return (
    <>
      <Hero  
        setShowLogInModal={setShowLogInModal}
        setShowRegisterModal={setShowRegisterModal}
      />
      {/* Login Modal */}
      {showLogInModal && (
        <AuthModal onClose={() => setShowLogInModal(false)}>
          <Login onClose={() => setShowLogInModal(false)}/>
        </AuthModal>
      )}
      {/* Register Modal */}
      {showRegisterModal && (
        <AuthModal onClose={() => setShowRegisterModal(false)}>
          <Register onClose={() => setShowRegisterModal(false)}/>
        </AuthModal>
      )}
    </>
  )
}

export default Landing