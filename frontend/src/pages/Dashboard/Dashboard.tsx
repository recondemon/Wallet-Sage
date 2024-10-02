import React from 'react'
import SideNav from '../../components/Dashboard/SideNav'
import Header from '../../components/Dashboard/Header'
import Home from '../../components/Dashboard/Home/Home'



const Dashboard = () => {
  const [activePage, setActivePage] = React.useState('home')

  return (
    <div className='flex h-screen w-full'>
      <SideNav 
        activePage={activePage} 
        setActivePage={setActivePage}
      />
      <div className='w-full'>
        {/* <Header /> */}
        <div>
          {activePage === 'home' && <Home />}
          {activePage === 'Accounts' && <div>Accounts</div>}
          {activePage === 'settings' && <div>Settings</div>}
          {activePage === 'profile' && <div>Profile</div>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard