import Navbar from "./components/Navbar"
import Home from "./Pages/Home"

const App = () => {
  return (
    <div className='h-screen bg-gradient-to-b from-gray-900 to-purple-900'>
      <Navbar/>
      <Home/>
    </div>
  )
}

export default App