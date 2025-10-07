export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image: string;
  featured?: boolean;
  metrics?: {
    users?: string;
    performance?: string;
    impact?: string;
  };
  caseStudy?: {
    problem: string;
    solution: string;
    results: string[];
  };
}

export interface Skill {
  category: string;
  items: string[];
}

export const profile = {
  name: "Adam Maulana",
  title: "Full Stack Web Developer & IT Trainer",
  email: "alwiadam1@gmail.com",
  github: "https://github.com/AlwiAM",
  linkedin: "https://www.linkedin.com/in/adam-maulana",
  bio: "A passionate Full Stack Developer and IT Trainer with 7+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js. Currently training 200+ students at Enigma Camp while developing enterprise solutions.",
};

export const skills: Skill[] = [
  {
    category: "Frontend Development",
    items: ["React.js", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "Responsive Design"],
  },
  {
    category: "Backend Development",
    items: ["Node.js", "Express.js", "Java Spring Boot", "Python Django", "GraphQL", "REST API"],
  },
  {
    category: "Database & Tools",
    items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Git", "CI/CD"],
  },
  {
    category: "Other Skills",
    items: ["System Design", "Microservices", "Technical Training", "Agile/Scrum", "Code Review"],
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Learning Platform",
    description: "Comprehensive LMS with interactive coding challenges, automated grading, and real-time progress tracking for 5,000+ students.",
    technologies: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "WebSocket", "Docker"],
    github: "https://github.com/AlwiAM/elearning-platform",
    demo: "https://enigmacamp.com",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
    featured: true,
    metrics: {
      users: "5,000+ students",
      performance: "98 Lighthouse",
      impact: "60% workload reduction"
    },
    caseStudy: {
      problem: "Bootcamp needed scalable platform for 500+ concurrent students with automated grading and real-time code execution.",
      solution: "Built microservices architecture with React, Spring Boot, sandboxed code execution, WebSocket for real-time updates, and Redis caching.",
      results: [
        "Reduced instructor grading time by 60%",
        "Improved student completion rate by 45%",
        "Achieved 99.9% uptime with 5,000+ active users",
        "Cut infrastructure costs by 30%"
      ]
    }
  },
  {
    id: 2,
    title: "Real-Time Analytics Dashboard",
    description: "Enterprise analytics platform processing 10M+ events daily with customizable charts, real-time updates, and AI-powered insights.",
    technologies: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Redis", "Chart.js"],
    github: "https://github.com/AlwiAM/analytics-dashboard",
    demo: "https://analytics-demo.vercel.app",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    featured: true,
    metrics: {
      users: "50+ enterprises",
      performance: "10M events/day",
      impact: "2.5s → 400ms load time"
    },
    caseStudy: {
      problem: "Clients needed real-time analytics with sub-second refresh rates while handling millions of daily events without performance degradation.",
      solution: "Implemented event streaming with Redis Pub/Sub, optimized MongoDB aggregation pipelines, and built progressive data loading with React Query.",
      results: [
        "Reduced query time from 2.5s to 400ms",
        "Handle 10M+ events/day without lag",
        "Saved $15k/month on database costs",
        "Increased client retention by 35%"
      ]
    }
  },
  {
    id: 3,
    title: "E-Commerce Marketplace",
    description: "Multi-vendor marketplace with AI product recommendations, real-time inventory, and integrated payment gateway serving 100k+ users.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS S3", "Elasticsearch"],
    github: "https://github.com/AlwiAM/marketplace",
    demo: "https://marketplace-demo.com",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    featured: true,
    metrics: {
      users: "100,000+ users",
      performance: "95 Lighthouse",
      impact: "150% sales increase"
    },
    caseStudy: {
      problem: "Local SMEs needed online presence during pandemic. Required multi-vendor support, real-time inventory sync, and mobile-friendly checkout.",
      solution: "Built scalable marketplace with vendor dashboard, Stripe integration, AI recommendations using collaborative filtering, and PWA for mobile.",
      results: [
        "Onboarded 500+ vendors in 3 months",
        "GMV increased 150% in first quarter",
        "Mobile conversion rate: 8.5% (industry avg: 3%)",
        "Payment success rate: 98.7%"
      ]
    }
  },
  {
    id: 4,
    title: "AI Chatbot Platform",
    description: "Multi-tenant chatbot platform with NLP, RAG architecture, and analytics dashboard serving 20+ businesses.",
    technologies: ["Next.js", "Python", "FastAPI", "Groq", "Pinecone", "PostgreSQL"],
    github: "https://github.com/AlwiAM/chatbot-platform",
    demo: "https://chatbot-saas.vercel.app",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    metrics: {
      users: "20+ businesses",
      performance: "80% automation rate",
      impact: "$50k saved/month"
    }
  },
  {
    id: 5,
    title: "Job Board Application",
    description: "Tech job portal with AI resume matching, video interviews, and applicant tracking system connecting 10k+ developers with companies.",
    technologies: ["React Native", "Node.js", "MongoDB", "WebRTC", "Firebase"],
    github: "https://github.com/AlwiAM/job-board",
    demo: "https://jobs.techconnect.dev",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    metrics: {
      users: "10,000+ developers",
      performance: "5,000+ matches/month",
      impact: "70% faster hiring"
    }
  },
  {
    id: 6,
    title: "Project Management SaaS",
    description: "Collaborative PM tool with Kanban boards, time tracking, Gantt charts, and integrations with Slack/GitHub used by 100+ teams.",
    technologies: ["Vue.js", "TypeScript", "Django", "PostgreSQL", "Redis", "Docker"],
    github: "https://github.com/AlwiAM/pm-saas",
    demo: "https://taskflow.app",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    metrics: {
      users: "100+ teams",
      performance: "Real-time sync",
      impact: "30% productivity boost"
    }
  },
  {
    id: 7,
    title: "Healthcare Appointment System",
    description: "Telemedicine platform with video consultations, prescription management, and EHR integration serving 50+ clinics.",
    technologies: ["React", "Node.js", "PostgreSQL", "Twilio", "AWS", "HIPAA-compliant"],
    github: "https://github.com/AlwiAM/healthtech",
    demo: "https://medconnect.health",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    metrics: {
      users: "50+ clinics",
      performance: "20,000+ consultations",
      impact: "HIPAA-compliant"
    }
  },
  {
    id: 8,
    title: "Inventory Management System",
    description: "Real-time inventory tracking with barcode scanning, predictive restocking, and multi-warehouse support for retail chains.",
    technologies: ["Angular", "Spring Boot", "MySQL", "Redis", "Kafka"],
    github: "https://github.com/AlwiAM/inventory-system",
    demo: "https://inventory-demo.com",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",
    metrics: {
      users: "15+ retailers",
      performance: "Real-time sync",
      impact: "40% waste reduction"
    }
  },
  {
    id: 9,
    title: "Social Media Analytics Tool",
    description: "Multi-platform analytics tracking Instagram, Twitter, TikTok with AI sentiment analysis and competitor monitoring.",
    technologies: ["React", "Node.js", "MongoDB", "Python", "TensorFlow", "Bull Queue"],
    github: "https://github.com/AlwiAM/social-analytics",
    demo: "https://socialytics.app",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    metrics: {
      users: "500+ marketers",
      performance: "1M posts analyzed",
      impact: "3x engagement increase"
    }
  },
  {
    id: 10,
    title: "IoT Environmental Monitor",
    description: "IoT dashboard for air quality monitoring with real-time alerts, historical trends, and predictive analytics for smart cities.",
    technologies: ["React", "Express", "InfluxDB", "MQTT", "Grafana", "Raspberry Pi"],
    github: "https://github.com/AlwiAM/iot-monitor",
    demo: "https://smartcity-iot.demo",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop",
    metrics: {
      users: "5 cities",
      performance: "100+ sensors",
      impact: "Early pollution alerts"
    }
  },
];
