import { useNavigate } from 'react-router-dom'
import navlogo from '../assets/Ninja Head.png'
import userlogo from '../assets/User.png'
import { useState, useEffect } from 'react'
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
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a12]/70 backdrop-blur-md">
      <div className="flex justify-between px-4 sm:px-8 py-3 items-center text-white">
        <div className="left flex items-center gap-2 sm:gap-3 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <img src={navlogo} alt="logo" className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105" />
          <h1 className="font-display text-gradient text-base sm:text-xl font-bold tracking-wide">
            GUESS THE ANIME CHARACTER
          </h1>
        </div>
        <div className="right cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Open account menu" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70">
              <img
                src={userlogo}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-white/15 hover:ring-purple-400/60 transition-all"
                alt="user-logo"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 mt-1 bg-[#14141d]/95 backdrop-blur-md border border-white/10 text-white shadow-xl">
              <DropdownMenuItem
                onClick={() => navigate("/userprofile")}
                className="cursor-pointer text-slate-200 focus:bg-purple-600/80 focus:text-white hover:bg-purple-600/80 hover:text-white flex items-center gap-2 transition-colors"
              >
                <User className="h-4 w-4" />
                {username}
              </DropdownMenuItem>
              {isAuthenticated ? (
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-slate-200 focus:bg-purple-600/80 focus:text-white hover:bg-purple-600/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={handleLogin}
                  className="cursor-pointer text-slate-200 focus:bg-purple-600/80 focus:text-white hover:bg-purple-600/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Navbar