export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export const profile = {
  name: "Alex Rodriguez",
  title: "Full Stack Web Developer",
  email: "alex.rodriguez@example.com",
  github: "https://github.com/alexrodriguez",
  linkedin: "https://linkedin.com/in/alexrodriguez",
  bio: "Passionate web developer with 5+ years of experience building modern, scalable web applications. Specialized in JavaScript/TypeScript ecosystem and cloud technologies.",
};

export const skills: Skill[] = [
  {
    category: "Frontend",
    items: ["React", "Vue.js", "Astro", "TypeScript", "Tailwind CSS", "Next.js"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "GraphQL"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "AWS", "Git", "GitHub Actions", "Vercel", "Cloudflare"],
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-featured online store with payment integration, inventory management, and real-time analytics dashboard.",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Prisma"],
    github: "https://github.com/alexrodriguez/ecommerce-platform",
    demo: "https://demo-ecommerce.example.com",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, drag-and-drop interface, and team chat.",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind"],
    github: "https://github.com/alexrodriguez/task-manager",
    demo: "https://tasks.example.com",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "Real-time weather tracking application with interactive maps, forecasts, and location-based alerts.",
    technologies: ["Vue.js", "Express", "OpenWeather API", "Chart.js", "Redis"],
    github: "https://github.com/alexrodriguez/weather-dashboard",
    demo: "https://weather.example.com",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Blog CMS",
    description: "Headless content management system with markdown support, SEO optimization, and multi-author capabilities.",
    technologies: ["Astro", "TypeScript", "Supabase", "Tailwind CSS"],
    github: "https://github.com/alexrodriguez/blog-cms",
    demo: "https://blog-cms.example.com",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "AI Chat Application",
    description: "Intelligent chatbot interface with conversation history, multiple AI models support, and context-aware responses.",
    technologies: ["React", "Python", "FastAPI", "OpenAI API", "PostgreSQL"],
    github: "https://github.com/alexrodriguez/ai-chat",
    demo: "https://chat.example.com",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Portfolio Analytics",
    description: "Analytics platform for tracking website performance, user behavior, and conversion metrics with beautiful visualizations.",
    technologies: ["Next.js", "TypeScript", "Vercel Analytics", "D3.js", "Redis"],
    github: "https://github.com/alexrodriguez/portfolio-analytics",
    demo: "https://analytics.example.com",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
];
