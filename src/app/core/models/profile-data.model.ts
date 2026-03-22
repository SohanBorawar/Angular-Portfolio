export interface ProfileData {
    profile: {
        name: string;
        title: string;
        avatarUrl?: string;
        summary: string;
        location?: string;
        status?: string;
    };
    about?: {
        heading: string;
        paragraph1: string;
        paragraph2: string;
        metrics: Array<{ number: string; label: string; }>;
    };
    skills: Array<{
        category: string;
        items: string[];
    }>;
    experience: Array<{
        role: string;
        company: string;
        duration: string;
        description: string[];
    }>;
    education: Array<{
        degree: string;
        institution: string;
        year: string;
        description?: string;
    }>;
    projects: Array<{
        title: string;
        description: string;
        technologies: string[];
        image?: string;
        github?: string;
        live?: string;
    }>;
    social: {
        linkedin: string;
        github: string;
        email: string;
    };
}
