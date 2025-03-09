import React from 'react'

const UserProfile = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] pt-16 flex items-start">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-base-300 rounded-xl shadow-lg border border-purple-900/30">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-purple-900 rounded-t-xl"></div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-base-300 overflow-hidden">
                <img 
                  src="/default-avatar.png" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-14 pb-4 px-4 space-y-6">
            {/* User Info */}
            <div className="text-center font-audiowide">
              <h1 className="text-2xl text-white font-bold">Username</h1>
              <p className="text-primary-content/70">@userhandle</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              <div className="stat-box">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-white/70">Games Played</div>
              </div>
              <div className="stat-box">
                <div className="text-2xl font-bold text-white">18</div>
                <div className="text-sm text-white/70">Wins</div>
              </div>
              <div className="stat-box">
                <div className="text-2xl font-bold text-white">75%</div>
                <div className="text-sm text-white/70">Win Rate</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-2">
              <h2 className="text-xl font-audiowide text-white">Recent Activity</h2>
              <div className="bg-base-200 rounded-lg p-4">
                <div className="space-y-2">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2 border-b border-base-300 last:border-none">
                      <span className="text-white/80">Game #{i + 1}</span>
                      <span className="text-white">Won</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile