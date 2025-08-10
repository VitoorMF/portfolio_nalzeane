import React, { useState, useEffect } from "react";
import "./EditBio.css";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useBio, type Bio } from "../../hooks/useBio";

export const EditBio: React.FC = () => {
  const { bio, loading, error } = useBio();
  const desc = bio[0] as Bio | undefined;

  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (desc?.bio !== undefined) {
      setValue(desc.bio);
    }
  }, [desc]);

  const handleEditClick = async () => {
    if (isEditing && desc?.id) {
      try {
        await updateDoc(doc(db, "bio", desc.id), {
          bio: value,
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
    <section className="edit_bio">
      <h2 className="form_title">Editar Bio</h2>
      <div className="bio_field">
        <textarea
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
