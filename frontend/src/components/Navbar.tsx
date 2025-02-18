import navlogo from '../assets/Ninja Head.png'
import userlogo from '../assets/User.png'

function Navbar() {
  return (
    <div className="flex justify-between px-4 sm:mx-8 py-4 items-center  text-white font-audiowide">
        <div className='left flex items-center gap-2 sm:gap-4'>
            <img src={navlogo} alt="logo" className="w-8 h-8 sm:w-auto sm:h-auto" />
            <h1 className='text-transparent text-lg sm:text-2xl font-bold bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300'>GUESS THE ANIME CHARACTER</h1>
        </div>
        <div className='right rounded-full'>
            <img src={userlogo} className='w-8 h-8 sm:w-12 sm:h-12 rounded-full' alt="user-logo" />
        </div>
    </div>
  )
}

export default Navbar