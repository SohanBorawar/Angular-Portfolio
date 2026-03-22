import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark-theme' | 'light-theme';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);

    // Initialize signal
    public currentTheme = signal<Theme>('dark-theme');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.initTheme();

            // Effect to reactively update DOM class when signal changes
            effect(() => {
                const theme = this.currentTheme();
                document.body.classList.remove('dark-theme', 'light-theme');
                document.body.classList.add(theme);
                localStorage.setItem('portfolio-theme', theme);
            });
        }
    }

    private initTheme(): void {
        const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
        if (savedTheme && (savedTheme === 'dark-theme' || savedTheme === 'light-theme')) {
            this.currentTheme.set(savedTheme);
        } else {
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            this.currentTheme.set(prefersLight ? 'light-theme' : 'dark-theme');
        }
    }

    public toggleTheme(): void {
        this.currentTheme.update(theme => theme === 'dark-theme' ? 'light-theme' : 'dark-theme');
    }

    public isDarkMode(): boolean {
        return this.currentTheme() === 'dark-theme';
    }
}
