import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <AuthProvider>
      <div className="app-shell min-h-screen text-slate-100">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
