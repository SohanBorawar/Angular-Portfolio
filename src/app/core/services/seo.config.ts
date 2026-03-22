import { inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export function configureSeo(title: Title, meta: Meta) {
    title.setTitle('IoT Developer Portfolio | Angular 19+');

    meta.addTags([
        { name: 'description', content: 'Modern IoT Developer Portfolio showcasing complex system architectures, ThingsBoard clusters, and robust frontend design based on Angular 19+ standalone components.' },
        { property: 'og:title', content: 'IoT Developer Portfolio | ThingsBoard Specialist' },
        { property: 'og:description', content: 'Explore my IoT architectural work, from embedded devices to scalable cloud dashboards.' },
        { property: 'og:type', content: 'website' }
    ]);
}
