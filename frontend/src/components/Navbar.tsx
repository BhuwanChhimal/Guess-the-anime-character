import { useNavigate } from 'react-router-dom'
import navlogo from '../assets/Ninja Head.png'
import userlogo from '../assets/User.png'
import { useContext, useState } from 'react'
import { LogIn, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from '../context/AuthContext' // Updated import path

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
  
  // Remove the useEffect since auth state is now managed by context

  function handleLogoClick() {
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className="flex justify-between px-4 sm:mx-8 py-4 items-center text-white font-audiowide">
      <div className='left flex items-center gap-2 sm:gap-4 cursor-pointer'
        onClick={handleLogoClick}
      >
        <img src={navlogo} alt="logo" className="w-8 h-8 sm:w-auto sm:h-auto" />
        <h1 className='text-transparent text-lg sm:text-2xl font-bold bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300'>
          GUESS THE ANIME CHARACTER
        </h1>
      </div>
      <div className='right cursor-pointer'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img src={userlogo} className='w-8 h-8 sm:w-12 sm:h-12 rounded-full' alt="user-logo" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-purple-700 border-none">
            {isAuthenticated ? (
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-white focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors"
              >
                <LogOut className="h-4 w-4 text-white" />
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={handleLogin} 
                className="cursor-pointer text-white focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors"
              >
                <LogIn className="h-4 w-4 text-white" />
                Login
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={()=> navigate("/userprofile")} className='cursor-pointer text-white focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors'
            >
              <User className='h-4 w-4 text-white'/>
                User name
              
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar