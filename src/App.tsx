import "./App.css";
import nana from "./assets/nana.png";
import nanaDesktop from "./assets/nana_desktop.jpg";

import VideoCarrousel from "./components/video_carroussel/VideoCarroussel";
import Links from "./components/links/Links";
import Partners from "./components/partners/Partners";
import About from "./components/about/About";
import Products from "./components/products/Products";
import Contact from "./components/contact/Contact";

function App() {
  return (
    <>
      <div className="stack">
        <picture>
          <source srcSet={nanaDesktop} media="(min-width: 800px)" />
          <img src={nana} alt="Foto de perfil" />
        </picture>
        <div className="gradient"></div>
      </div>

      <div className="body">
        <h1 className="title">Nalzeane Normanha</h1>
        <h2 className="subtitle">Eng. Agrônoma | MC do Agro | Comunicação</h2>
        <Links />
        <VideoCarrousel />
        <Partners />
        <About />
        <Products />
        <Contact />
      </div>

      <footer className="footer">
        <div className="line"></div>
        <p className="footer_text">
          © 2025 Nalzeane Normanha | Todos os direitos reservados.
        </p>
        <p className="footer_text">12.345.678/0001-90</p>
      </footer>
    </>
  );
}

export default App;
