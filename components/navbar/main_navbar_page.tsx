import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'
import Navbar from '../navbar'

const MainNavbarPage = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession()

  return (
   <>
          <Navbar user={await getUser() ?? {}} isUserAuthenticated={!!isAuthenticated} />
    
   </>
  )
}

export default MainNavbarPage