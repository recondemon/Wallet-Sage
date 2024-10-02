import { CircleUser, House, Settings, WalletCards } from 'lucide-react'
import React from 'react'
import clsx from 'clsx'

interface SideNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({activePage, setActivePage}) => {
  
  const activeStyle = 'text-primary hover:text-primary hover:cursor-pointer'
  const inactiveStyle = 'text-foreground hover:text-primary hover:cursor-pointer'

  const handleSelection = (page: string) => {
    setActivePage(page)
  }

  return (
    <div className='flex flex-col justify-between py-8 p-4 border-r-2 rounded-lg bg-altBackground'>
      <div className='flex flex-col gap-4'>
        <House 
        className={clsx(activePage === 'home' ? activeStyle : inactiveStyle)}
        size={30}
        onClick={() => handleSelection('home')}
        />
        <WalletCards 
        className={clsx(activePage === 'accounts' ? activeStyle : inactiveStyle)}
        size={30}
        onClick={() => handleSelection('accounts')}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <Settings 
        className={clsx(activePage === 'settings' ? activeStyle : inactiveStyle)}
        size={30}
        onClick={() => handleSelection('settings')}
        />
        <CircleUser 
        className={clsx(activePage === 'profile' ? activeStyle : inactiveStyle)}
        size={30}
        onClick={() => handleSelection('profile')}
        />
      </div>
    </div>
  )
}

export default SideNav