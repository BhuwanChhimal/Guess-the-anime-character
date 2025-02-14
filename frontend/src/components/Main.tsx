import React, { useState } from 'react';

const Main = () => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle guess submission logic here
    setGuess('');
  };

  return (
    <div className="w-full h-[45rem] max-w-4xl bg-[#d9d9d9] rounded-lg p-8 shadow-2xl font-audiowide">
      {/* Title Section */}
      <div className="bg-black text-white py-4 rounded-2xl mb-6">
        <h1 className="text-center text-xl ">
          GUESS THE ANIME CHARACTER
        </h1>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-sm">
          Hit play to get a random anime character and try to guess that character
        </p>
      </div>

      {/* Play Button */}
      <div className="flex justify-center mb-8">
        <button className="bg-white px-8 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow">
          Play
        </button>
      </div>

      {/* Guess Input Section */}
      <div className="mb-8">
        <p className=" mb-2">Enter your guess:</p>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter any anime character..."
            className="flex-1 outline-0 px-4 py-2 rounded-md bg-white text-sm"
          />
          <button
            type="submit"
            className="bg-white px-6 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow "
          >
            Enter
          </button>
        </form>
      </div>

      {/* Results Table */}
      <div>
        <p className="font-mono mb-2">Your guess:</p>
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-gray-200 text-center text-sm">
            <div className="p-3">Anime Name</div>
            <div className="p-3">Gender</div>
            <div className="p-3">Hair Color</div>
            <div className="p-3">Power Type</div>
            <div className="p-3">Weapon</div>
            <div className="p-3">Role</div>
            <div className="p-3">Species</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;