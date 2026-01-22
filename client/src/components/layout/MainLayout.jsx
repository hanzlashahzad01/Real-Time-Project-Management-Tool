import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Trello,
    Settings,
    LogOut,
    Menu,
    X,
    Plus,
    Bell,
    Search,
    User as UserIcon
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import ThemeToggle from '../ThemeToggle';
import NotificationDropdown from '../NotificationDropdown';

const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Trello, label: 'My Boards', path: '/boards' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                !isSidebarOpen && "-translate-x-full md:w-20"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                            <Trello className="text-white" size={20} />
                        </div>
                        {isSidebarOpen && <span className="font-outfit font-bold text-xl tracking-tight">Antigravity</span>}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                    location.pathname === item.path
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} className={cn(
                                    "transition-colors",
                                    location.pathname === item.path ? "text-primary" : "group-hover:text-foreground"
                                )} />
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* User profile / Logout */}
                    <div className="p-4 border-t border-border mt-auto">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <img
                                src={user?.avatar}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full border-2 border-primary/20"
                            />
                            {isSidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            className={cn("w-full gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500", !isSidebarOpen && "px-0")}
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            {isSidebarOpen && <span>Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-accent rounded-lg text-muted-foreground hidden md:block"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="relative max-w-md hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 lg:w-96"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <NotificationDropdown />
                        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} />
                            <span className="hidden sm:inline">New Project</span>
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => window.location.reload()} // Simple refresh to show new workspace on dashboard
            />
        </div>
    );
};

export default MainLayout;
