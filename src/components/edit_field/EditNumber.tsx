// src/components/EditNumber.tsx
import React, { useState, useEffect } from "react";
import "./EditField.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useTelephone, type Telephone } from "../../hooks/useTelephone";

export const EditNumber: React.FC = () => {
  const { telephone, loading, error } = useTelephone();
  const entry = telephone[0] as Telephone | undefined;

  const [value, setValue] = useState<string>("");    // agora string
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (entry) {
      setValue(entry.number);
    }
  }, [entry]);

  const handleEditClick = async () => {
    if (isEditing && entry?.id) {
      // validação de dígitos e tamanho
      if (!/^[0-9]{8,}$/.test(value)) {
        alert("Informe um telefone válido (somente dígitos, mínimo 8).");
        return;
      }
      try {
        await updateDoc(doc(db, "telephone", entry.id), {
          number: value.trim(),   // string exata
        });
        console.log("Número salvo:", value);
      } catch (e) {
        console.error("Erro ao salvar no Firestore:", e);
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <p>Carregando…</p>;
  if (error)   return <p>Erro: {error.message}</p>;

  return (
    <section className="edit-field">
      <h2 className="form_title">Editar Telefone</h2>
      <div className="form_field">
        <input
          type="tel"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!isEditing}
          placeholder="Somente dígitos"
        />
        <button className="send_btn" onClick={handleEditClick}>
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>
    </section>
  );
};
