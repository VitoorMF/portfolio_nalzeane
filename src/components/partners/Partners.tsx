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
  isAdmin?: boolean;
};

function Partners({ isAdmin = false }: PartnersProps) {
  const { partners, loading: partnersLoading, error: partnersError } = usePartners();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<string | null>(null);

  const [newPartnerId, setNewPartnerId] = React.useState<string | null>(null);
  const [addPartnerDialogOpen, setAddPartnerDialogOpen] = React.useState(false);

  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const confirmDeletePartner = async () => {
    if (!partnerToDelete) return;
    try {
      await deleteDoc(doc(db, "partners", partnerToDelete));
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
    } catch (err) {
      console.error("Erro ao criar partner:", err);
    } finally {
      setAddPartnerDialogOpen(false);
      setNewPartnerId(null);
    }
  };

  const handlePartnerClick = (partner: Partner, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) {
      setPartnerToDelete(partner.id);
      setDeleteDialogOpen(true);
    }
  };

  const scrollByAmount = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8); // rola ~80% da largura visível
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="partners">
      <h3 className="section_title">Parceiros</h3>

      {partnersLoading && <p>Carregando parceiros…</p>}
      {partnersError && <p>Erro ao carregar parceiros: {partnersError.message}</p>}

      {!partnersLoading && !partnersError && (
        <div className="carousel_wrap">
          <button
            type="button"
            className="carousel_btn carousel_btn--prev"
            aria-label="Anterior"
            onClick={() => scrollByAmount(-1)}
          >
            ❮
          </button>

          <div
            className="carousel_track"
            ref={trackRef}
            // acessibilidade: setas do teclado também navegam
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scrollByAmount(1);
              if (e.key === "ArrowLeft") scrollByAmount(-1);
            }}
            tabIndex={0}
            aria-label="Carrossel de parceiros"
          >
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="partner_slide"
                role="button"
                tabIndex={0}
                aria-label={partner.name}
                onClick={(e) => handlePartnerClick(partner, e)}
                onKeyDown={(e) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (e.key === "Enter" || e.key === " ") handlePartnerClick(partner, e as any);
                }}
              >
                <div className="partner_tile">
                  <img src={partner.src} alt={partner.name} className="partner_img" />
                  <div className="partner_overlay">
                    <span className="partner_name">{partner.name}</span>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="partner_delete_btn"
                      title="Excluir parceiro"
                      aria-label={`Excluir ${partner.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPartnerToDelete(partner.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isAdmin && (
              <button
                type="button"
                className="partner_slide add_slide"
                onClick={handleAddPartner}
                aria-label="Adicionar parceiro"
                title="Adicionar parceiro"
              >
                <div className="add_tile">
                  <span className="add_plus">＋</span>
                  <span>Adicionar</span>
                </div>
              </button>
            )}
          </div>

          <button
            type="button"
            className="carousel_btn carousel_btn--next"
            aria-label="Próximo"
            onClick={() => scrollByAmount(1)}
          >
            ❯
          </button>

          {/* fades nas bordas para indicar overflow */}
          <div className="carousel_edge carousel_edge--left" aria-hidden="true" />
          <div className="carousel_edge carousel_edge--right" aria-hidden="true" />
        </div>
      )}

      <AddPartnerDialog
        open={addPartnerDialogOpen}
        onClose={() => {
          setAddPartnerDialogOpen(false);
          setNewPartnerId(null);
        }}
        socialId={newPartnerId ?? ""}
        onCreate={handleCreatePartner}
      />

      <DeletDialog
        open={deleteDialogOpen}
        onConfirm={confirmDeletePartner}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </section>
  );
}

export default Partners;
