import React, { ChangeEvent, useState } from 'react'
import { UserData } from '../../../api/userService'

function Searchbar({ users } : { users: UserData[]}) {

  const [searchQuery, setSearchQuery] = useState('')

  function handleChange(e :ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    setSearchQuery(e.target.value)    
  }

  return (
    <div className='w-2/3 mx-auto'>
      <input onChange={(e) => handleChange(e)} value={searchQuery} className='w-full bg-tertiary mx-auto rounded-full text-white text-xs p-2 px-3 border-2 border-transparent transition-colors ease-in-out 150 focus:outline-none focus:border-2 focus:border-primary' type="text" name="search" id="search" placeholder='Search people...' />
    </div>
  )
}

export default Searchbar