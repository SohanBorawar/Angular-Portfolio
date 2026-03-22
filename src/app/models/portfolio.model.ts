export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tech: string[];
    github?: string;
    live?: string;
}

export interface SkillGroup {
    name: string;
    skills: string[];
}

export interface Job {
    role: string;
    company: string;
    date: string;
    description: string[];
}

export interface Education {
    degree: string;
    institution: string;
    duration: string;
    description?: string;
}
