import whatsappIcon from "../../assets/icons/whatsapp.svg";
import instagramIcon from "../../assets/icons/instagram.svg";
import tiktokIcon from "../../assets/icons/tiktok.svg";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import "./Links.css";

function Links() {
  return (
    <section className="links">
      <h3 className="section_title">Meus Links</h3>

      <div className="link_group">
        <a
          href="https://wa.me/5577999418263?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20trabalho!"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="link_btn">
            <img src={whatsappIcon} alt="WhatsApp" className="link_icon" />
            <span className="link_btn_text">WhatsApp</span>
          </div>
        </a>

        <a
          href="https://www.instagram.com/nana_normanha/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="link_btn">
            <img src={instagramIcon} alt="Instagram" className="link_icon" />
            <span className="link_btn_text">Instagram</span>
          </div>
        </a>

        <a
          href="https://www.tiktok.com/@nmaga21"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="link_btn">
            <img src={tiktokIcon} alt="Tiktok" className="link_icon" />
            <span className="link_btn_text">Tiktok</span>
          </div>
        </a>

        <a
          href="https://www.linkedin.com/in/nalzeane-magalhaes-normanha-5477381a5/?originalSubdomain=br"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="link_btn">
            <img src={linkedinIcon} alt="Linkedin" className="link_icon" />
            <span className="link_btn_text">Linkedin</span>
          </div>
        </a>
      </div>
    </section>
  );
}

export default Links;
