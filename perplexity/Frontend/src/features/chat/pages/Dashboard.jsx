import React from 'react'
import { useSelector } from 'react-redux'
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
console.log(user);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
    </div>
  )
}

export default Dashboard