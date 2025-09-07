import React from "react";
import { useSocialLinks } from "../../hooks/useSocialLinks";
import FormDialog from "../dialogs/UrlDialog";
import "./Links.css";
import { useCallback } from "react";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import AddLinkDialog, { type NewLinkValues } from "../dialogs/addLinkDialog";

interface SocialLinkProps {
  id?: string; // opcional para novos links
  url: string;
  name: string;
  icon?: string;
  isAdmin?: boolean;
  onClick?: () => void;
}

const SocialLink: React.FC<SocialLinkProps> = ({
  url,
  name,
  icon = "",
  isAdmin = false,
  onClick,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isAdmin) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        onClick?.();
      }
    },
    [url, isAdmin, onClick]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isAdmin) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        onClick?.();
      }
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={name}
      className="link_btn"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: "pointer" }}
    >
      {icon && <img src={icon} alt={name} className="link_icon" />}
      <span className="link_btn_text">{name}</span>
    </div>
  );
};

interface LinksProps {
  isAdmin?: boolean;
}

function Links({ isAdmin = false }: LinksProps) {
  const REQUIRED_IDS = ["instagram", "tiktok", "linkedin"];

  const { socials, loading, error } = useSocialLinks();
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
  const [selectedLink, setSelectedLink] =
    React.useState<SocialLinkProps | null>(null);

  const [newLinkId, setNewLinkId] = React.useState<string | null>(null);
  const [addLinkDialogOpen, setAddLinkDialogOpen] = React.useState(false);
  const [items, setItems] = React.useState<SocialLinkProps[]>([]);

  React.useEffect(() => {
    setItems(socials);
  }, [socials]);

  const isRequired =
    !!selectedLink?.id && REQUIRED_IDS.includes(selectedLink.id.toLowerCase());

  async function handleDeleteSelected() {
    if (!selectedLink?.id) return;
    const ok = window.confirm(
      `Tem certeza que deseja excluir "${selectedLink.name}"?`
    );
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "links", selectedLink.id));
      setItems((prev) => prev.filter((it) => it.id !== selectedLink.id));
      setLinkDialogOpen(false);
      setSelectedLink(null);
    } catch (err) {
      console.error("Erro ao excluir link:", err);
    }
  }

  const handleSubmit = async (data: { url: string; name?: string }) => {
    if (!selectedLink?.id) return;

    const docRef = doc(db, "links", selectedLink.id);

    try {
      await updateDoc(docRef, {
        url: data.url,
        name: data.name ?? selectedLink.name,
      });

      // Reflete na UI
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedLink.id
            ? { ...it, url: data.url, name: data.name ?? it.name }
            : it
        )
      );
      setSelectedLink((prev) =>
        prev ? { ...prev, url: data.url, name: data.name ?? prev.name } : prev
      );
    } catch (err) {
      console.error("Erro ao atualizar link:", err);
    }
  };

  const handleAddLink = () => {
    setAddLinkDialogOpen(true);
  };

  const handleCreateLink = async (data: NewLinkValues) => {
    try {
      const colRef = collection(db, "links");
      const docRef = await addDoc(colRef, { url: data.url, name: data.name }); // <<--

      // Reflete na UI
      setItems((prev) => [
        ...prev,
        { id: docRef.id, url: data.url, name: data.name },
      ]);

      setAddLinkDialogOpen(false);
      setNewLinkId(null);
    } catch (err) {
      console.error("Erro ao criar link:", err);
      alert((err as Error).message);
    }
  };

  if (loading) return <div>Carregando links...</div>;
  if (error) return <div>Erro ao carregar links: {error.message}</div>;

  return (
    <section className="links">
      <h3 className="section_title">Meus Links</h3>

      <div className="link_group">
        {items.map((s) => (
          <SocialLink
            key={s.id ?? s.name}
            id={s.id}
            url={s.url}
            name={s.name}
            icon={s.icon}
            isAdmin={isAdmin}
            onClick={() => {
              setSelectedLink(s); // <-- guarda o link
              setLinkDialogOpen(true); // <-- abre o dialog
            }}
          />
        ))}
      </div>
      <AddLinkDialog
        open={addLinkDialogOpen}
        onClose={() => {
          setAddLinkDialogOpen(false);
          setNewLinkId(null);
        }}
        socialId={newLinkId!}
        onCreate={handleCreateLink}
      />

      {isAdmin && (
        <div className="add_field" onClick={handleAddLink}>
          <div className="add">Adicionar</div>
        </div>
      )}

      <FormDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        socialUrl={selectedLink?.url}
        socialName={selectedLink?.name}
        onSubmit={handleSubmit}
        canDelete={Boolean(selectedLink?.id) && !isRequired}
        onDelete={handleDeleteSelected}
      />
    </section>
  );
}

export default Links;
