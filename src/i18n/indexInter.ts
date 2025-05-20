export interface Index {
  title: string;
  lang: string;
  heroSection: HeroSection;
  featuresSection: FeaturesSection;
  pricingSection: PricingSection;
  ctaSection: CtaSection;
}

export interface HeroSection {
  heading: string;
  description: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
}

export interface Cta {
  text: string;
  link: string;
}

export interface FeaturesSection {
  heading: string;
  features: Feature[];
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface PricingSection {
  heading: string;
  plans: Plan[];
}

export interface Plan {
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface CtaSection {
  heading: string;
  description: string;
  cta: Cta;
}
export const INDEX_EN: Index = {
  title: 'Home',
  lang: 'en',
  heroSection: {
    heading: 'Unleash the Power of AI with',
    description:
      'Experience the future of artificial intelligence. Create, enhance, and innovate with our cutting-edge AI tools.',
    ctaPrimary: {
      text: 'Coming Soon',
      link: '#',
    },
    ctaSecondary: {
      text: 'Learn more →',
      link: '#features',
    },
  },
  featuresSection: {
    heading: 'Powerful AI Features',
    features: [
      {
        title: 'Advanced AI Chat',
        description: 'Engage in intelligent conversations with our advanced AI chat system.',
        icon: 'bi-chat-left-text-fill',
      },
      {
        title: 'Image Generation',
        description:
          //"Create stunning images with our AI-powered image generation tool.",
          'Very soon you will be able to create stunning images with our AI-powered image generation tool.',
        icon: 'bi-image',
      },
      {
        title: 'Web Development',
        description: 'Develop websites quickly and efficiently with our AI web development tools.',
        icon: 'bi-code-slash',
      },
      {
        title: 'Photo Enhancement',
        description: 'Enhance your photos with professional-grade AI enhancements.',
        icon: 'bi-image-alt',
      },
      {
        title: 'Video Creation',
        description:
          //"Produce high-quality videos effortlessly using our AI video creation feature.",
          'Very soon you will be able to produce high-quality videos effortlessly using our AI video creation feature.',
        icon: 'bi-film',
      },
      {
        title: 'Voice Synthesis',
        description:
          //"Generate realistic voiceovers with our AI voice synthesis technology.",
          'Very soon you will be able to generate realistic voiceovers with our AI voice synthesis technology.',
        icon: 'bi-mic',
      },
    ],
  },
  pricingSection: {
    heading: 'Choose Your Plan',
    plans: [
      {
        name: 'Free',
        price: '0',
        features: [
          'Basic AI Chat',
          'Simple Image Generation',
          '720p Video Creation',
          'Basic Photo Enhancement',
          'Limited Web Templates',
        ],
        cta: 'Start Free',
        popular: false,
      },
      {
        name: 'Standard',
        price: '10',
        features: [
          'Advanced AI Chat',
          'HD Image Generation',
          '1080p Video Creation',
          'Advanced Photo Enhancement',
          'Custom Web Development',
          'Voice Synthesis',
          'Priority Support',
        ],
        cta: 'Enjoy the Experience',
        popular: true,
      },
      {
        name: 'Pro',
        price: '20',
        features: [
          'Custom AI Solutions',
          '4K Image Generation',
          '4K Video Creation',
          'Professional Photo Enhancement',
          'Full Web Development Suite',
          'Custom Voice Models',
          '24/7 Support',
          'API Access',
        ],
        cta: 'Unleash the Power',
        popular: false,
      },
    ],
  },
  ctaSection: {
    heading: 'Ready to Transform Your Ideas?',
    description:
      'Join thousands of creators and businesses using Xintheria AI to bring their ideas to life.',
    cta: {
      text: 'Get Started Free',
      link: '/app/chat',
    },
  },
};

export const INDEX_ES: Index = {
  title: 'Inicio',
  lang: 'es',
  heroSection: {
    heading: 'Desata el Poder de la IA con',
    description:
      'Experimenta el futuro de la inteligencia artificial. Crea, mejora e innova con nuestras herramientas de IA de vanguardia.',
    ctaPrimary: {
      text: 'Comenzar',
      link: '/signin',
    },
    ctaSecondary: {
      text: 'Registrarse',
      link: '/signup',
    },
  },
  featuresSection: {
    heading: 'Potentes Funciones de IA',
    features: [
      {
        title: 'Chat de IA Avanzado',
        description:
          'Interactúa en conversaciones inteligentes con nuestro avanzado sistema de chat IA.',
        icon: 'bi-chat-left-text-fill',
      },
      {
        title: 'Generación de Imágenes',
        description:
          //"Crea imágenes impresionantes con nuestra herramienta de IA.",
          'Muy pronto podrás crear imágenes impresionantes con nuestra herramienta de IA.',
        icon: 'bi-image',
      },
      {
        title: 'Desarrollo Web',
        description:
          'Desarrolla sitios web rápida y eficientemente con nuestras herramientas de IA.',
        icon: 'bi-code-slash',
      },
      {
        title: 'Mejora de Fotos',
        description: 'Optimiza tus fotos con mejoras de calidad profesional.',
        icon: 'bi-image-alt',
      },
      {
        title: 'Creación de Videos',
        description:
          //"Produce videos de alta calidad sin esfuerzo con nuestra IA.",
          'Muy pronto podrás producir videos de alta calidad sin esfuerzo con nuestra IA.',
        icon: 'bi-film',
      },

      {
        title: 'Síntesis de Voz',
        description:
          //"Genera voces realistas con nuestra tecnología de síntesis de voz.",
          'Muy pronto podrás generar voces realistas con nuestra tecnología de síntesis de voz.',
        icon: 'bi-mic',
      },
    ],
  },
  pricingSection: {
    heading: 'Elige Tu Plan',
    plans: [
      {
        name: 'Gratis',
        price: '0',
        features: [
          'Chat de IA Básico',
          'Generación de Imágenes Simple',
          'Creación de Videos en 720p',
          'Mejora de Fotos Básica',
          'Plantillas Web Limitadas',
        ],
        cta: 'Comenzar Gratis',
        popular: false,
      },
      {
        name: 'Estandar',
        price: '10',
        features: [
          'Chat de IA Avanzado',
          'Generación de Imágenes en HD',
          'Creación de Videos en 1080p',
          'Mejora de Fotos Avanzada',
          'Desarrollo Web Personalizado',
          'Síntesis de Voz',
          'Soporte Prioritario',
        ],
        cta: 'Disfruta la Experiencia',
        popular: true,
      },
      {
        name: 'Pro',
        price: '20',
        features: [
          'Soluciones de IA Personalizadas',
          'Generación de Imágenes en 4K',
          'Creación de Videos en 4K',
          'Mejora de Fotos Profesional',
          'Suite Completa de Desarrollo Web',
          'Modelos de Voz Personalizados',
          'Soporte 24/7',
          'Acceso a la API',
        ],
        cta: 'Desata el Poder',
        popular: false,
      },
    ],
  },
  ctaSection: {
    heading: '¿Listo para Transformar Tus Ideas?',
    description:
      'Únete a miles de creadores y empresas que utilizan Xintheria AI para dar vida a sus ideas.',
    cta: {
      text: 'Empieza Gratis',
      link: '/app/chat',
    },
  },
};
