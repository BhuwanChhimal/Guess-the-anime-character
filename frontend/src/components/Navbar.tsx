import navlogo from '../assets/Ninja Head.png'
import userlogo from '../assets/User.png'

function Navbar() {
  return (
    <div className="flex justify-between mx-8 items-center text-white font-audiowide">
        <div className='left flex items-center gap-4'>
            <img src={navlogo} alt="logo" />
            <h1>GUESS THE ANIME CHARACTER</h1>
        </div>
        <div className='right rounded-full'>
            <img src={userlogo}  className='w-12 h-12 rounded-full' alt="user-logo" />
        </div>
    </div>
  )
}

export default Navbar