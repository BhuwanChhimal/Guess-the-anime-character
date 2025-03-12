import { useNavigate } from 'react-router-dom'
import navlogo from '../assets/Ninja Head.png'
import userlogo from '../assets/User.png'
import { useContext, useState, useEffect } from 'react'
import { LogIn, LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '../context/AuthContext' // Update this import
import { getUserName } from "../constants/getUserName";

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [username, setUsername] = useState<string | null>('User')

  useEffect(() => {
    const fetchUsername = async () => {
      if (isAuthenticated) {
        const name = await getUserName()
        setUsername(name || 'User')
      } else {
        setUsername('User')
      }
    }
    fetchUsername()
  }, [isAuthenticated])

  function handleLogoClick() {
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    logout() // Use the logout function from auth context
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
          <DropdownMenuItem 
              onClick={()=> navigate("/userprofile")} className='cursor-pointer text-white focus:bg-purple-600 focus:text-white hover:bg-purple-600 hover:text-white flex items-center gap-2 transition-colors'
            >
              <User className='h-4 w-4 text-white'/>
              {username}
            </DropdownMenuItem>
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
           
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navbar