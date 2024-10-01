import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../../lib/firebase/firebase'

interface RegisterProps {
    onClose: () => void
}

const Register: React.FC<RegisterProps> = ({onClose}) => {
    //* Form States
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [dob, setDob] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    //* Register Function
    //! ---- Move registration logic to authUtils.ts? maybe... ----
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if(password !== confirmPassword) {
            setError('Passwords do not match')
        }

        let user 

        try {
            //? Create User in firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //? prepare data for backend
            const userData = {
                uid: user.uid,
                firstName,
                lastName,
                userName,
                dob,
                email,
              };

            //? send data to backend
            const response = await fetch('/api/users/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            //! ---- add better error handling ----
            if(response.ok) {
                onClose()
            }else {
                if(user) {
                    await deleteUser(user)
                }
                setError('Registration failed on the backend, user deleted from Firebase.')

            }
        } catch (error) {
            if(user) {
                await deleteUser(user)
            }
            setError('Registration failed')
        }
    }

    //! ---- TODO: add validations below ----
    //! file "authUtils.ts" to hold validation logic

  return (
    <div className='flex flex-col gap-4 p-4'>
        <h1 className='text-2vw font-bold text-center mb-4'>
            Register
        </h1>
        <form 
        className='flex flex-col gap-4'
        onSubmit={handleRegister}
        >
            <div className='flex gap-2'>
                <input 
                    type='text'
                    placeholder='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                    type='text'
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className='w-full'>
                <input 
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full'
                />
            </div>
            <div className='flex gap-2 w-full'>
                <input 
                    type='text'
                    placeholder='Username'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className='w-1/2'
                />
                <input 
                    type='date'
                    placeholder='Date of Birth'
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className='w-1/2'
                />
            </div>
            <div className='flex gap-2 w-full'>
                <input 
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Confirm Password'
                />
            </div>
            <button
            className='bg-primary p-2 w-full rounded-lg hover:bg-muted hover:shadow-lg shadow-shadow'
            type='submit'
            >
                Register
            </button>
        </form>
    </div>
  )
}

export default Register