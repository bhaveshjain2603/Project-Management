import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BtnPrimary from './BtnPrimary'
import LoginModal from './LoginModal' // Updated to AuthModal for consistency
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    setIsLogin(!!localStorage.getItem('token'));
    const handleStorageChange = () => {
      setIsLogin(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  
  const handleAuth = () => {
    if (isLogin) {
      localStorage.removeItem('token'); // ✅ Logout action
      delete axios.defaults.headers.common['Authorization'];
      setIsLogin(!isLogin);
      toast.success('User logged out Successfully');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className='flex items-center justify-between px-10 bg-white shadow h-20'>
      <h1 className='text-2xl font-semibold'>Project</h1>
      
      <BtnPrimary onClick={handleAuth}>
        {isLogin ? 'Logout' : 'Login'}
      </BtnPrimary>

      <LoginModal 
        isOpen={isAuthModalOpen} 
        setIsOpen={setIsAuthModalOpen} 
        setIsLogin={setIsLogin}
      />
    </div>
  )
}

export default Navbar