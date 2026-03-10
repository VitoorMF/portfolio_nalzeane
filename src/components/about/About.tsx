import "./About.css";
import { useBio, type Bio } from "../../hooks/useBio";

function sanitizeBio(raw: string) {
  // Escapa tudo e reabilita apenas tags permitidas para destaque/linhas.
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&lt;(\/?strong)&gt;/gi, "<$1>")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />");
}

function About() {
  const { bio, loading, error } = useBio();
  const profile: Bio | undefined = bio[0];

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <section className="about">
      <h3 className="section_title">Quem sou eu</h3>
      <p
        className="about_text"
        dangerouslySetInnerHTML={{
          __html: sanitizeBio(profile?.bio ?? ""),
        }}
      />
    </section>
  );
}

export default About;
