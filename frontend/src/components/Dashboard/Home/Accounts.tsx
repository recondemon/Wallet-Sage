import React, { useEffect } from 'react'
import { PlaidLinkButton } from '../../UI/PlaidLinkButton'
import { useUserStore } from '../../../stores/userStore'


const Accounts = () => {
    const user = useUserStore(state => state.user)

    useEffect(() => {
        console.log(user)
    }
    , [user])
  return (
    <div>
        <div>
            <h2>
                Accounts
            </h2>
            <PlaidLinkButton userId={user?.uid} />
        </div>
    </div>
  )
}

export default Accounts