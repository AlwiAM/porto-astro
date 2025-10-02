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
  name: "Adam Maulana",
  title: "IT Trainer | Tech Enthusiast",
  email: "alwiadam1@gmail.com",
  github: "https://github.com/adammaulana",
  linkedin: "https://www.linkedin.com/in/aadammaulana",
  bio: "A passionate IT Trainer and tech enthusiast with expertise in web development using Java Spring Boot, React.js, and React Native. Formally studying Electrical Engineering and Business Management, I excel in leveraging communication and teaching skills to guide students through complex coding concepts at Enigma Camp.",
};

export const skills: Skill[] = [
  {
    category: "Frontend Development",
    items: ["React.js", "React Native", "Angular", "JavaScript", "HTML/CSS", "Responsive Design"],
  },
  {
    category: "Backend Development",
    items: ["Java Spring Boot", "Node.js", "Express.js", "SQL", "MySQL", "RESTful APIs"],
  },
  {
    category: "Tools & Others",
    items: ["Git", "Docker", "Project Management", "Technical Support", "Teaching & Mentoring"],
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Modern E-Learning Platform",
    description: "Comprehensive online learning platform with course management, student tracking, and interactive coding challenges for IT training.",
    technologies: ["React.js", "Spring Boot", "MySQL", "JWT", "REST API"],
    github: "https://github.com/adammaulana/elearning-platform",
    demo: "https://demo-elearning.example.com",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    title: "Student Management System",
    description: "Full-stack application for managing student data, attendance, assignments, and performance tracking for bootcamp training.",
    technologies: ["React", "Node.js", "Express.js", "MySQL", "Bootstrap"],
    github: "https://github.com/adammaulana/student-management",
    demo: "https://student-mgmt.example.com",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    title: "Code Practice Platform",
    description: "Interactive coding practice platform where students can solve programming challenges with real-time feedback and progress tracking.",
    technologies: ["React.js", "Spring Boot", "PostgreSQL", "WebSocket", "Docker"],
    github: "https://github.com/adammaulana/code-practice",
    demo: "https://codelab.example.com",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    title: "Portfolio Website Builder",
    description: "React-based website builder helping students create professional portfolio websites with customizable templates and components.",
    technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS", "AWS S3"],
    github: "https://github.com/adammaulana/portfolio-builder",
    demo: "https://builder.example.com",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    title: "Job Board Application",
    description: "Job portal connecting bootcamp graduates with tech companies, featuring resume builder and application tracking system.",
    technologies: ["React Native", "Spring Boot", "MySQL", "Firebase", "REST API"],
    github: "https://github.com/adammaulana/job-board",
    demo: "https://jobs.example.com",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    title: "Micro Wind Turbine IoT",
    description: "IoT-based monitoring system for micro wind turbine with real-time data visualization and performance analytics.",
    technologies: ["React.js", "Express.js", "MQTT", "InfluxDB", "Chart.js"],
    github: "https://github.com/adammaulana/wind-turbine-iot",
    demo: "https://windiot.example.com",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop",
  },
];
