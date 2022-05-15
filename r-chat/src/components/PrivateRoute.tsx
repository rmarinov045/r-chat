import React, { ReactElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import Spinner from './utils/Spinner'

function PrivateRoute({ component }: { component: ReactElement }) {
    const navigate = useNavigate()

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                navigate('/')
                return
            }
            setLoaded(true)
        })

        return () => setLoaded(false)
    }, [navigate])

    return (
        loaded ? component : <Spinner />
    )
}

export default PrivateRoute