import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';
import useThemeStore from '../store/useThemeStore';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-10 h-10 hover:bg-accent transition-colors"
        >
            {theme === 'dark' ? (
                <Sun size={20} className="text-yellow-400 rotate-0 scale-100 transition-all" />
            ) : (
                <Moon size={20} className="text-primary rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default ThemeToggle;
