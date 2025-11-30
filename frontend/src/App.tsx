import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import ChatAppPage from "./pages/ChatApp";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          {/* protectect routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<ChatAppPage />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;