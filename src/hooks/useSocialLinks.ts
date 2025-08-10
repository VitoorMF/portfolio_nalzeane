// useSocialLinks.ts
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import whatsappIcon from "../assets/icons/whatsapp.svg";
import instagramIcon from "../assets/icons/instagram.svg";
import tiktokIcon from "../assets/icons/tiktok.svg";
import linkedinIcon from "../assets/icons/linkedin.svg";

export interface SocialLinkProps {
  name: string;
  url: string;
  icon?: string;
  id?: string; // útil como key
}

const SOCIAL_META: Record<string, { name: string; icon?: string }> = {
  whatsapp: { name: "WhatsApp", icon: whatsappIcon },
  instagram: { name: "Instagram", icon: instagramIcon },
  tiktok: { name: "Tiktok", icon: tiktokIcon },
  linkedin: { name: "Linkedin", icon: linkedinIcon },
};

// IDs obrigatórios na ordem desejada
const REQUIRED_ORDER = ["whatsapp", "instagram", "tiktok", "linkedin"];

// Fallback para exibir um nome bonito quando não houver meta nem name no doc
function prettyNameFromId(id: string) {
  return id.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// (opcional) valida URLs http(s)
function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type LinkDoc = {
  url?: string;
  name?: string; // usado nos "outros links" (ex.: VQWeePgM18zqEq7iw922)
  icon?: string; // se quiser permitir definir um ícone custom no Firestore
};

export function useSocialLinks() {
  const [socials, setSocials] = useState<SocialLinkProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const snap = await getDocs(collection(db, "links"));

        const docs = snap.docs.map((d) => ({
          id: d.id,
          idLower: d.id.toLowerCase(),
          data: d.data() as LinkDoc,
        }));

        const added = new Set<string>();
        const result: SocialLinkProps[] = [];

        // 1) Adiciona obrigatórios na ordem
        for (const key of REQUIRED_ORDER) {
          const found = docs.find((d) => d.idLower === key); // <= aqui
          if (!found) continue;
          const url = (found.data.url || "").trim();
          if (!url || !isValidUrl(url)) continue;

          const meta = SOCIAL_META[key];
          result.push({
            id: found.id, // mantém o ID ORIGINAL
            url,
            name:
              meta?.name ??
              found.data.name?.trim() ??
              prettyNameFromId(found.id),
            icon: meta?.icon ?? found.data.icon,
          });
          added.add(found.id);
        }

        // 2) Adiciona quaisquer outros que existirem (como VQWeePgM18zqEq7iw922)
        for (const { id, idLower, data } of docs) {
          // <= inclua idLower
          if (added.has(id)) continue;
          const url = (data.url || "").trim();
          if (!url || !isValidUrl(url)) continue;

          const meta = SOCIAL_META[idLower]; // <= aqui
          result.push({
            id,
            url,
            name: meta?.name ?? data.name?.trim() ?? prettyNameFromId(id),
            icon: meta?.icon ?? data.icon,
          });
          added.add(id);
        }

        if (mounted) setSocials(result);
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { socials, loading, error };
}
