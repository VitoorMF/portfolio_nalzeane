import React, { useState, useEffect } from "react";
import "./EditField.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useEmail, type Email } from "../../hooks/useEmail";

export const EditEmail: React.FC = () => {
  const { email, loading, error } = useEmail();
  const mail = email[0] as Email | undefined;

  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // regex simples para validar formato de e-mail
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Preenche o input assim que carregar o email
  useEffect(() => {
    if (mail?.address !== undefined) {
      setValue(mail.address);
    }
  }, [mail]);

  const handleEditClick = async () => {
    if (isEditing && mail?.id) {
      // validação antes de salvar
      if (!isValidEmail(value)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      try {
        await updateDoc(doc(db, "email", mail.id), {
          address: value, // campo correto para bater com as regras
        });
        console.log("Email salvo:", value);
      } catch (e) {
        console.error("Erro ao salvar no Firestore:", e);
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <section className="edit-field">
      <h2 className="form_title">Editar Email</h2>
      <div className="form_field">
        <input
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isEditing}
        />
        <button className="send_btn" onClick={handleEditClick}>
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>
    </section>
  );
};
