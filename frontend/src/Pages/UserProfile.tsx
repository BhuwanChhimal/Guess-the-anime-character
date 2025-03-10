import React from "react";
import userlogo from "../assets/avatar.png";
import { UserRoundPen } from "lucide-react";
import smallLuffy from "../assets/smolLuffy.png";
import smallNaruto from "../assets/smolNaruto.png";
const UserProfile = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] pt-16 flex items-start bg-gradient-to-b from-gray-900 to-purple-900 ">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="rounded-xl shadow-lg border-2 hover:shadow-xl transition-transform relative">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-24 rounded-t-xl"></div>
           
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 ">
              <div className="w-32 h-32 rounded-full border-4 border-base-300 overflow-hidden ">
                <img
                  src={userlogo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <UserRoundPen className="text-white w-10 h-10 bg-black/80 rounded-full p-2 absolute -right-2 top-20"/>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-14 pb-4 px-4 space-y-6">
            {/* User Info */}
            <div className="text-center font-audiowide">
              <h1 className="text-2xl text-white font-bold">Username</h1>
              <p className="text-white/70">@userhandle</p>

            </div>
            <div className="bg-white w-full h-0.5"/>
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
              <h2 className="text-xl font-audiowide text-white">
                Recent Activity
              </h2>
              <div className="bg-base-200 rounded-lg p-4">
                <div className="space-y-2">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 border-b last:border-none"
                    >
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
  );
};

export default UserProfile;
