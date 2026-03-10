// src/pages/AdminPage.tsx
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      alert(`Erro de autenticação. ${(err as Error).message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1 className="title_adm">Painel Admin</h1>
          <p className="subtitle_adm">
            Gerencie o conteúdo público do site em um só lugar.
          </p>
        </div>
        <button
          type="button"
          className="logout_btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Saindo..." : "Sair"}
        </button>
      </header>

      <section className="admin-panel">
        <h2 className="admin-panel_title">Textos e Contato</h2>
        <div className="admin-grid admin-grid--forms">
          <EditField />
          <EditBio />
          <EditNumber />
          <EditEmail />
        </div>
      </section>

      <section className="admin-panel">
        <h2 className="admin-panel_title">Links, Parceiros, Produtos e Videos</h2>
        <div className="admin-grid">
          <Links isAdmin />
          <Partners isAdmin />
          <Products isAdmin />
          <VideosGrid isAdmin />
        </div>
      </section>
    </main>
  );
}
