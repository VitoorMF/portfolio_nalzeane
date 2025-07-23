import "./Products.css";

function Products() {
  const productsList = [
    {
      id: 1,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_603417-MLB54277664534_032023-O-nada-pode-me-ferir-cant-hurt-me-de-david-goggins-livro-nacional-em-portugus-edico-ilustrada-2023-novo.webp",
      name: "Nada pode me ferir - David Goggins",
      link: "https://produto.mercadolivre.com.br/MLB-3251110239-nada-pode-me-ferir-cant-hurt-me-de-david-goggins-livro-nacional-em-portugus-edico-ilustrada-2023-novo-_JM?matt_tool=45889666&matt_internal_campaign_id=&matt_word=&matt_source=google&matt_campaign_id=22090354034&matt_ad_group_id=173090524236&matt_match_type=&matt_network=g&matt_device=c&matt_creative=727882726761&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=292225515&matt_product_id=MLB3251110239&matt_product_partition_id=2388138864950&matt_target_id=aud-1967156880386:pla-2388138864950&cq_src=google_ads&cq_cmp=22090354034&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=1&gad_campaignid=22090354034&gbraid=0AAAAAD93qcBSyjf5GVRept_1Zhiqh-j0L&gclid=Cj0KCQjwkILEBhDeARIsAL--pjyJP0WL_T1UX8ardagteDsNXJ2ASSPXxtCmqgrNliQ9-osNVHtpQHsaAsexEALw_wcB", // substitua pelo link real
    },
    {
      id: 2,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_616873-MLU50456261949_062022-O.webp",
      name: "Hábitos Atômicos - James Clear",
      link: "https://www.mercadolivre.com.br/habitos-atmicos-um-metodo-facil-e-comprovado-de-criar-bons-habitos-e-se-livrar-dos-maus/p/MLB19299491?pdp_filters=item_id:MLB3398537833&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3398537833&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjzrnxeFjKcTojfUgpw2E0Y746vs9m7tWDPQojeDFuNE_aQBlTjFlyIaAhoCEALw_wcB",
    },
    {
      id: 3,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_929947-MLU73140279729_112023-O.webp",
      name: "Poder e Manipulação - Jacob Petry",
      link: "https://www.mercadolivre.com.br/poder-e-manipulaco-de-jacob-petry-editora-faro-editorial-capa-mole-edico-2016-em-portugus-2019/p/MLB19212131?pdp_filters=item_id%3AMLB5214317296&from=gshop&matt_tool=40511462&matt_internal_campaign_id=&matt_word=&matt_source=google&matt_campaign_id=22127124170&matt_ad_group_id=173399230773&matt_match_type=&matt_network=g&matt_device=c&matt_creative=729051405510&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=735128188&matt_product_id=MLB19212131-product&matt_product_partition_id=2375096926482&matt_target_id=aud-1966489759667:pla-2375096926482&cq_src=google_ads&cq_cmp=22127124170&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=1&gad_campaignid=22127124170&gbraid=0AAAAAD93qcDM1erkUgBX9YK_ieIpt5N-Z&gclid=Cj0KCQjwkILEBhDeARIsAL--pjxLpP9pWG7IiUpeDiNPJz5KS0m8sRzjj1Jzl0ngUx1eiGQg-iCkjWQaArg1EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
    {
      id: 4,
      image:
        "https://http2.mlstatic.com/D_NQ_NP_830311-MLU74111629212_012024-O.webp",
      name: "As 48 Leis do Poder - Robert Greene",
      link: "https://www.mercadolivre.com.br/as-48-leis-do-poder-robert-greene-editora-rocco-ltda/p/MLB19202572?pdp_filters=item_id:MLB3387381111&matt_tool=39309960&matt_internal_campaign_id=321186561&matt_word=&matt_source=google&matt_campaign_id=22060114741&matt_ad_group_id=188443228008&matt_match_type=&matt_network=g&matt_device=c&matt_creative=765283537406&matt_keyword=&matt_ad_position=&matt_ad_type=pla&matt_merchant_id=349321054&matt_product_id=MLB3387381111&matt_product_partition_id=2431924193734&matt_target_id=pla-2431924193734&cq_src=google_ads&cq_cmp=22060114741&cq_net=g&cq_plt=gp&cq_med=pla&gad_source=4&gad_campaignid=22060114741&gbraid=0AAAAAD93qcDzP3zE5ZOHyp7qWruoESjKI&gclid=Cj0KCQjwkILEBhDeARIsAL--pjy0Xo8r_li-NQHdcKaaK3bDDpxz-Lr2Pbo9p8t81GpdgrG560-vTjEaAtY4EALw_wcB",
    },
  ];

  return (
    <section className="products">
      <h3 className="section_title">Produtos</h3>
      <div className="product_carrousel">
        {productsList.map((product) => (
          <a
            href={product.link}
            className="product"
            key={product.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="product_image"
            />
            <p className="product_description">{product.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Products;
