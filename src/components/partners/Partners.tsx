// Partners.tsx
import React from "react";
import "./Partners.css";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import DeletDialog from "../dialogs/DeletDialog";
import { usePartners } from "../../hooks/usePartners";
import AddPartnerDialog from "../dialogs/addPartnerDialog";

export type Partner = { id: string; name: string; src: string };

export type PartnersProps = {
  partnersList?: Partner[];
  isAdmin?: boolean;
};

function Partners({ isAdmin }: PartnersProps) {
  const {
    partners,
    loading: partnersLoading,
    error: partnersError,
  } = usePartners();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<string | null>(
    null
  );

  const [newPartnerId, setNewPartnerId] = React.useState<string | null>(null);
  const [addPartnerDialogOpen, setAddPartnerDialogOpen] = React.useState(false);

  const confirmDeletePartner = async () => {
    if (!partnerToDelete) return;
    try {
      await deleteDoc(doc(db, "partners", partnerToDelete));
      console.log("Parceiro excluído:", partnerToDelete);
      // se usePartners não refetcha automaticamente, você pode disparar reload aí
    } catch (err) {
      console.error("Erro ao excluir parceiro:", err);
    } finally {
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
    }
  };

  const handleAddPartner = () => {
    const generated = doc(collection(db, "partners")).id;
    setNewPartnerId(generated);
    setAddPartnerDialogOpen(true);
  };

  const handleCreatePartner = async (data: Partner) => {
    try {
      await setDoc(doc(db, "partners", data.id), {
        src: data.src,
        name: data.name,
      });
      console.log("Partner criado:", data);
      // se não usa real-time subscription, pode chamar reload() do hook
    } catch (err) {
      console.error("Erro ao criar partner:", err);
    }
  };

  return (
    <section className="partners">
      <h3 className="section_title">Parceiros</h3>
      {partnersLoading && <p>Carregando parceiros…</p>}
      {partnersError && (
        <p>Erro ao carregar parceiros: {partnersError.message}</p>
      )}
      {!partnersLoading && !partnersError && (
        <div className="partner_carrousel">
          {partners.map((partner) => (
            <div
              className="partner"
              key={partner.id}
              onClick={(e) => {
                e.stopPropagation();
                if (isAdmin) {
                  setPartnerToDelete(partner.id);
                  setDeleteDialogOpen(true);
                }
              }}
            >
              <div
                className="partner-content"
                // se quiser clicar no card para outra ação, separa do delete
              >
                <img src={partner.src} alt={partner.name} />
              </div>
            </div>
          ))}

          {!partners.length && (
            <p className="no_partners">Nenhum parceiro cadastrado.</p>
          )}

          <AddPartnerDialog
            open={addPartnerDialogOpen}
            onClose={() => {
              setAddPartnerDialogOpen(false);
              setNewPartnerId(null);
            }}
            socialId={newPartnerId!}
            onCreate={handleCreatePartner}
          />
          <DeletDialog
            open={deleteDialogOpen}
            onConfirm={confirmDeletePartner}
            onClose={() => {
              setDeleteDialogOpen(false);
            }}
          />
        </div>
      )}
      {isAdmin && (
        <div className="add_field" onClick={handleAddPartner}>
          <div className="add">Adicionar</div>
        </div>
      )}
    </section>
  );
}

export default Partners;
