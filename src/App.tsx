import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminPage } from "./pages/admin_page/AdminPage";
import HomePage from "./pages/home_page/HomePage"; // seu código atual movido para cá
import LoginPage from "./pages/login_page/Loginpage";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
