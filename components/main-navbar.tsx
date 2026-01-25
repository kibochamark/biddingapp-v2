import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import React from 'react'
import Navbar from './navbar';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';

const MainNavbar = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();
    const user = isUserAuthenticated ? await getUser() : {};


  return (
    <>
    
      <Navbar user={user} isUserAuthenticated={isUserAuthenticated}/>
    
    </>
  )
}

export default MainNavbar