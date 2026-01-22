import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Clock, Inbox, Sparkles, X } from 'lucide-react';
import { Button } from './ui/Button';
import useNotificationStore from '../store/useNotificationStore';
import { cn } from '../utils/cn';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        loading
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} className={cn("transition-colors", isOpen ? "text-primary" : "text-muted-foreground")} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 glass-card rounded-3xl border border-border shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold font-outfit">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="text-[10px] text-muted-foreground hover:text-red-500 font-medium flex items-center gap-1"
                                >
                                    <Trash2 size={10} /> Clear all
                                </button>
                            )}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[10px] text-primary hover:underline font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading && notifications.length === 0 ? (
                            <div className="p-10 text-center space-y-3">
                                <Sparkles className="mx-auto text-primary animate-pulse" size={32} />
                                <p className="text-sm text-muted-foreground">Checking for updates...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-border/30">
                                {notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        className={cn(
                                            "p-4 hover:bg-muted/30 transition-colors relative group",
                                            !n.read && "bg-primary/5"
                                        )}
                                    >
                                        {!n.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                        )}
                                        <div className="flex gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center",
                                                !n.read ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                                                n.type === 'user_status' && "bg-amber-500 text-white"
                                            )}>
                                                {n.type === 'user_status' ? <Sparkles size={20} /> : <Inbox size={20} />}
                                            </div>
                                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !n.read && markAsRead(n._id)}>
                                                <p className={cn("text-sm leading-tight mb-1", !n.read ? "font-semibold" : "text-muted-foreground")}>
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <Clock size={12} />
                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {!n.read && (
                                                    <button
                                                        onClick={() => markAsRead(n._id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-primary/10 rounded-lg text-primary"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(n._id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-500/10 rounded-lg text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground space-y-4">
                                <Bell className="mx-auto opacity-20" size={48} />
                                <p className="text-sm">No notifications yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-border bg-muted/10 text-center">
                        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            View all activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
