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
        company?: string;
        employer?: string;
        role?: string;
        title?: string;
        position?: string;
        startDate?: string;
        start?: string;
        endDate?: string;
        end?: string;
        current?: boolean;
        location?: string;
        description?: string;
        summary?: string;
        highlights?: string[] | string;
        bullets?: string[];
    }>;
    education: Array<{
        degree?: string;
        title?: string;
        qualification?: string;
        institution?: string;
        school?: string;
        university?: string;
        field?: string;
        major?: string;
        subject?: string;
        startDate?: string;
        start?: string;
        endDate?: string;
        end?: string;
        year?: string;
        grade?: string;
        gpa?: string;
        score?: string;
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
