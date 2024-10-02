import React from 'react'

const Accounts = () => {
    const handleAddAccount = () => {
        console.log('Add New Account')
    }
    
  return (
    <div>
        <div>
            <h2>
                Accounts
            </h2>
            <p
            className=''
            onClick={handleAddAccount}
            >
                Add New Account
            </p>
        </div>
    </div>
  )
}

export default Accounts