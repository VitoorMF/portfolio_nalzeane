import { useEffect, useState } from "react";
import "./Contact.css";
import whiteWhatsappIcon from "../../assets/icons/whatsapp_white.png";
import phoneIcon from "../../assets/icons/phone-flip.svg";
import { useTelephone, type Telephone } from "../../hooks/useTelephone";

function Contact() {
  const { telephone, loading, error } = useTelephone();
  const num = telephone[0] as Telephone | undefined;

  const [value, setValue] = useState("");

  const [email, setEmail] = useState("");

  const handleSend = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    const subject = encodeURIComponent("Novo contato pelo site");

    window.location.href = `mailto:nnormanha@outlook.com?subject=${subject}`;
    setEmail("");
  };

  useEffect(() => {
    if (num?.number !== undefined) {
      setValue(num.number);
    }
  }, [num]);

  return (
    <section className="contact">
      <h3 className="section_title">Contato</h3>

      <div className="email_form_field">
        <input
          type="text"
          placeholder="insira seu e-mail"
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
          href={`https://wa.me/55${
            loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error.message}</p>
            ) : (
              value
            )
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact_btn whatsapp">
            <img src={whiteWhatsappIcon} alt="WhatsApp" />
          </div>
        </a>
        <a
          href={`tel:+55${
            loading ? (
              <p>Carregando...</p>
            ) : error ? (
              <p>Erro: {error.message}</p>
            ) : (
              value
            )
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="contact_btn phone">
            <img src={phoneIcon} alt="Phone" />
          </div>
        </a>
      </div>
    </section>
  );
}

export default Contact;
