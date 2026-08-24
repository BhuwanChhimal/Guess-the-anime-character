import React, { useEffect, useState } from "react";
import userlogo from "../assets/avatar.png";
import { Camera, Gamepad2, Trophy, Target } from "lucide-react";
import { getUserName } from "../constants/getUserName";
import { authService } from "@/services/authService";

const UserProfile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateProfile } = authService;
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const name = await getUserName();
        setUsername(name);
      } catch (error) {
        console.error("Error fetching username:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Games Played", value: "24", icon: Gamepad2, color: "text-violet-400" },
    { label: "Wins", value: "18", icon: Trophy, color: "text-amber-400" },
    { label: "Win Rate", value: "75%", icon: Target, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-[calc(100vh-10rem)] pt-10 pb-8 flex items-start justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="surface rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-28 bg-gradient-to-r from-violet-600/40 via-fuchsia-600/30 to-violet-600/40" />

            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-28 h-28 rounded-full border-4 border-[#0f0f17] overflow-hidden relative group shadow-xl">
                <img
                  src={selectedImg || userlogo}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Camera className="w-7 h-7 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-6 px-4 sm:px-8 space-y-8">
            {/* User Info */}
            <div className="text-center">
              <h1 className="font-display text-2xl text-white font-bold">
                {username || "Guest"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">Anime detective</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="stat-box">
                  <Icon className={`${color} mb-1`} size={20} />
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    {value}
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="space-y-3">
              <h2 className="font-display text-lg text-white">
                Recent Activity
              </h2>
              <div className="surface-muted rounded-xl divide-y divide-white/5">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <span className="text-slate-300 text-sm">
                      Game #{i + 1}
                    </span>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2.5 py-0.5">
                      Won
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
