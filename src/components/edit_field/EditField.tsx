import React, { useState, useEffect } from "react";
import "./EditField.css";
import { useDescription, type Description } from "../../hooks/useDescription";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";

export const EditField: React.FC = () => {
  const { description, loading, error } = useDescription();
  const desc = description[0] as Description | undefined;

  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Popula o input assim que carregar o título
  useEffect(() => {
    if (desc?.title !== undefined) {
      setValue(desc.title);
    }
  }, [desc]);

  const handleEditClick = async () => {
    if (isEditing && desc?.id) {
      try {
        await updateDoc(doc(db, "description", desc.id), {
          title: value,
        });
        console.log("Valor salvo:", value);
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
      <h2 className="form_title">Editar Título</h2>
      <div className="form_field">
        <input
          type="text"
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
