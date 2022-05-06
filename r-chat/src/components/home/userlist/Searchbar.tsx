import React, { Dispatch, useEffect, useState } from 'react'
import { userAPI } from '../../../api/userService'
import { auth } from '../../../firebase'
import useDebounce from '../../hooks/useDebounce'

function Searchbar({ setUsers, loading }: { setUsers: Function, loading: Dispatch<boolean> }) {

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearch = useDebounce(searchQuery, 500)

  function handleSearch(e: any) {
    loading(true)
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (debouncedSearch) {
      setUsers([])
      userAPI.getUserByUserName(debouncedSearch).then(users => setUsers(users.filter(x => x.id !== auth.currentUser?.uid))).catch(error => console.log(error))
      // api call for queried users
      setTimeout(() => loading(false), 250)
    } else {
      userAPI.getAllUsers().then(users => setUsers(users.filter(x => x.id !== auth.currentUser?.uid))).catch(error => console.log(error))
      setTimeout(() => loading(false), 250)
      // api call for all users      
    }
  }, [debouncedSearch, setUsers, loading])

  return (
    <div className='w-2/3 mx-auto'>
      <input onChange={(e) => handleSearch(e)} value={searchQuery} className='w-full bg-tertiary mx-auto rounded-full text-white text-xs p-2 px-3 border-2 border-transparent transition-colors ease-in-out 150 focus:outline-none focus:border-2 focus:border-primary' type="text" name="search" id="search" placeholder='Search people...' />
    </div>
  )
}

export default Searchbar