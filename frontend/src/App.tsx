import Navbar from "./components/Navbar"
import Home from "./Pages/Home"

const App = () => {
  return (
    <div className='h-screen bg-[#303030]'>
      <Navbar/>
      <Home/>
    </div>
  )
}

export default App