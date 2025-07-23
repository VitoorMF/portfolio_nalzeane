import { useState } from "react";
import "./Contact.css";
import whiteWhatsappIcon from "../../assets/icons/whatsapp_white.png";
import phoneIcon from "../../assets/icons/phone-flip.svg";

function Contact() {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (!email.includes("@")) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Lógica de envio (simulação)
    alert(`Email enviado`);

    setEmail(""); // limpa o campo
  };

  return (
    <section className="contact">
      <h3 className="section_title">Contato</h3>

      <div className="email_form_field">
        <input
          type="text"
          placeholder="nome@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="send_btn" onClick={handleSend}>
          Enviar
        </div>
      </div>
      <span>ou</span>
      <div className="contacts_row">
        <a
          href="https://wa.me/5577999418263"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact_btn whatsapp">
            <img src={whiteWhatsappIcon} alt="WhatsApp" />
          </div>
        </a>
        <a href="tel:+5577999418263" target="_blank" rel="noopener noreferrer">
          <div className="contact_btn phone">
            <img src={phoneIcon} alt="Phone" />
          </div>
        </a>
      </div>
    </section>
  );
}

export default Contact;
