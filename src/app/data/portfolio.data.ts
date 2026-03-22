import { Project, SkillGroup, Job } from '../models/portfolio.model';

export const PROJECTS_DATA: Project[] = [
    {
        id: '1',
        title: 'Smart Factory Monitoring',
        description: 'An enterprise-grade ThingsBoard dashboard for real-time industrial machine telemetry, OEE calculation, and predictive maintenance alerts.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        tech: ['ThingsBoard', 'Angular 19', 'MQTT', 'Python'],
        github: 'https://github.com/example/factory',
        live: 'https://example.com/factory'
    },
    {
        id: '2',
        title: 'Fleet Tracking Dashboard',
        description: 'Scalable IoT platform for tracking high-value shipments globally. Features live geofencing, shock monitoring, and secure role-based access.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7fc8347?auto=format&fit=crop&q=80&w=800',
        tech: ['ThingsBoard', 'PostgreSQL', 'Python', 'Angular'],
        github: 'https://github.com/example/fleet',
        live: 'https://example.com/fleet'
    },
    {
        id: '3',
        title: 'Smart Home Automation',
        description: 'Consumer-facing IoT application managing connected home devices, utilizing rule chains to automate energy savings and alert on security anomalies.',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
        tech: ['ThingsBoard', 'MQTT', 'Python', 'PostgreSQL'],
        github: 'https://github.com/example/home',
        live: 'https://example.com/home'
    }
];

export const SKILLS_DATA: SkillGroup[] = [
    {
        name: 'IoT Platforms & Architecture',
        skills: ['ThingsBoard', 'IoT Architecture', 'Device Management', 'Rule Engine']
    },
    {
        name: 'Protocols & Connectivity',
        skills: ['MQTT', 'CoAP', 'HTTP/HTTPS', 'WebSockets']
    },
    {
        name: 'Backend & Data',
        skills: ['Python', 'PostgreSQL', 'Real-time Analytics', 'REST APIs']
    },
    {
        name: 'Frontend Frameworks',
        skills: ['Angular', 'TypeScript', 'Dashboard Development', 'SCSS']
    }
];

export const EXPERIENCE_DATA: Job[] = [
    {
        role: 'IoT Developer',
        company: 'Sohanlal Borawar',
        date: 'Present',
        description: [
            'ThingsBoard Platform Development for enterprise clients.',
            'Data visualization, creating comprehensive custom dashboards.',
            'Developing robust rule chains for intelligent data processing and device integration.'
        ]
    },
    {
        role: 'IoT Firmware & Integration Engineer',
        company: 'Industrial Automation Partners',
        date: '2021 - 2023',
        description: [
            'Connected manufacturing hardware using custom Python edge agents and MQTT.',
            'Reduced system latency by 20% by implementing local telemetry aggregation.',
            'Collaborated with frontend teams to link real-time databases (PostgreSQL) into internal web tools.'
        ]
    },
    {
        role: 'Junior Embedded Systems Developer',
        company: 'DataStream Sensors',
        date: '2019 - 2021',
        description: [
            'Wrote tracking logic deployed to field sensors spanning thousands of geographical locations.',
            'Authored testing harnesses ensuring 99.9% device uptime.'
        ]
    }
];

export const EDUCATION_DATA = [
    {
        degree: 'Bachelor of Technology - BTech',
        institution: 'Geetanjali Institute of Technical Studies (GITS), Udaipur',
        duration: '2019 - 2023',
        description: 'Focused on Computer Science, intelligent systems, and scalable software architecture.'
    }
];
