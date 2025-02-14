import Main from "../components/Main"
import CharacterCard from "../components/CharacterCard"

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] p-4 lg:p-8">
      <div className="container h-[80%] mx-auto flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-center">
        <div className="w-full lg:w-2/3 h-full">
          <Main />
        </div>
        <div className="w-full lg:w-1/3 h-full">
          <CharacterCard />
        </div>
      </div>
    </div>
  )
}

export default Home