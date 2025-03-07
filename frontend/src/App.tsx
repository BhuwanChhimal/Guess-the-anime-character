import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <div className="h-screen bg-gradient-to-b from-gray-900 to-purple-900">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
