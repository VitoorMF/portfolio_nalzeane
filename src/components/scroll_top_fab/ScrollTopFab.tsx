import React from "react";
import "./ScrollTopFab.css";

type Props = {
  iconSrc: string;          // caminho da imagem do ícone
  threshold?: number;       // quanto rolar (px) para botão aparecer
  title?: string;           // tooltip/aria-label
};

export default function ScrollTopFab({
  iconSrc,
  threshold = 300,
  title = "Voltar ao topo",
}: Props) {
  const [visible, setVisible] = React.useState(false);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > threshold);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    onScroll(); // checa no mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scrolltop_fab ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label={title}
      title={title}
      type="button"
    >
      <img src={iconSrc} alt="" aria-hidden="true" />
    </button>
  );
}
