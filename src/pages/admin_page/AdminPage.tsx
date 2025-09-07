// src/pages/AdminPage.tsx
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../../firebase/config";
import Partners from "../../components/partners/Partners";
import Products from "../../components/products/Products";
import Links from "../../components/links/Links";

import "./AdminPage.css";
import { EditField } from "../../components/edit_field/EditField";
import { EditBio } from "../../components/edit_bio/EditBio";
import { EditNumber } from "../../components/edit_field/EditNumber";
import { EditEmail } from "../../components/edit_field/EditEmail";
import VideosGrid from "../../components/videos_grid/VideosGrid";

export function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      alert(`Erro de autenticação. ${(err as Error).message}`);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>

      <EditField />
      <EditBio />
      <EditNumber />
      <EditEmail />

      <Links isAdmin={true} />
      <Partners isAdmin={true} />
      <Products isAdmin={true} />
      <VideosGrid isAdmin />


      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
