interface Link {
  text: string;
  link: string;
}

interface Section {
  heading: string;
  links: Link[];
}

interface SocialLink {
  name: string;
  link: string;
  icon: string;
}

interface Footer {
  companyName: string;
  description: string;
  sections: Section[];
  socialLinks: SocialLink[];
  copyright: string;
}

export const FOOTER_EN: Footer = {
  companyName: "Xintheria",
  description:
    "Unleash creativity with our advanced AI tools for generating multiple types of content.",
  sections: [
    {
      heading: "Product",
      links: [
        { text: "Features", link: "/#features" },
        //{ text: "Pricing", link: "#pricing" },
      ],
    },
    {
      heading: "Resources",
      links: [
        //{ text: "Blog", link: "/blog" },
        //{ text: "Documentation", link: "/docs" },
        { text: "Help Center", link: "/help" },
      ],
    },
    {
      heading: "Company",
      links: [
        //{ text: "About", link: "/about" },
        //{ text: "Contact", link: "/contact" },
        { text: "Privacy Policy", link: "/privacy" },
        { text: "Terms of Service", link: "/terms" },
      ],
    },
  ],
  socialLinks: [
    { name: "X/Twitter", link: "https://x.com/xintheria", icon: "twitter" },
    {
      name: "Instagram",
      link: "https://www.instagram.com/xintheria",
      icon: "instagram",
    },
    {
      name: "Facebook",
      link: "https://www.facebook.com/xintheria",
      icon: "facebook",
    },
    {
      name: "YouTube",
      link: "https://www.youtube.com/@Xintheria",
      icon: "youtube",
    },
  ],
  copyright:
    "© " + new Date().getFullYear() + " Xintheria. All rights reserved.",
};

export const FOOTER_ES: Footer = {
  companyName: "Xintheria",
  description:
    "Desata la creatividad con nuestras herramientas avanzadas de IA para la generación de multiples tipos de contenido.",
  sections: [
    {
      heading: "Producto",
      links: [
        { text: "Características", link: "/#features" },
        //{ text: "Precios", link: "#pricing" },
      ],
    },
    {
      heading: "Recursos",
      links: [
        //{ text: "Blog", link: "/blog" },
        //{ text: "Documentación", link: "/docs" },
        { text: "Centro de ayuda", link: "/help" },
      ],
    },
    {
      heading: "Compañía",
      links: [
        //{ text: "Acerca de", link: "/about" },
        //{ text: "Contacto", link: "/contact" },
        { text: "Política de privacidad", link: "/privacy" },
        { text: "Términos de servicio", link: "/terms" },
      ],
    },
  ],
  socialLinks: [
    { name: "X/Twitter", link: "https://x.com/xintheria", icon: "twitter" },
    {
      name: "Instagram",
      link: "https://www.instagram.com/xintheria",
      icon: "instagram",
    },
    {
      name: "Facebook",
      link: "https://www.facebook.com/xintheria",
      icon: "facebook",
    },
    {
      name: "YouTube",
      link: "https://www.youtube.com/@Xintheria",
      icon: "youtube",
    },
  ],
  copyright:
    "© " +
    new Date().getFullYear() +
    " Xintheria. Todos los derechos reservados.",
};
