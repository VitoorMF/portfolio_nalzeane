import "./Partners.css";

function Partners() {
  const partnersList = [
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Aiba",
      src: "https://aiba.org.br/wp-content/uploads/2022/06/LOGOTIPO_AIBA-03.png.webp",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
    {
      name: "Brq",
      src: "https://brasilquimica.com.br/wp-content/uploads/2024/12/favicon-brq.png",
    },
  ];

  return (
    <section className="partners">
      <h3 className="section_title">Parceiros</h3>

      <div className="partner_carrousel">
        {partnersList.map((partner) => (
          <div className="partner" key={partner.name}>
            <img src={partner.src} alt={partner.name} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Partners;
