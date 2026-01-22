import React, { useEffect, useState } from 'react';
import { Trello, Search, Filter, Plus, ChevronRight, Layout, Globe, Lock } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const MyBoardsPage = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAllBoards = async () => {
            try {
                // Fetch boards from all workspaces the user is part of
                const res = await api.get('/boards');
                setBoards(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllBoards();
    }, []);

    const filteredBoards = boards.filter(board =>
        board.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="h-10 bg-muted/50 w-64 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-muted/30 rounded-2xl border border-border/50"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight">My Boards</h1>
                    <p className="text-muted-foreground mt-1">Access all your projects across different workspaces.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a board..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoards.map((board) => (
                    <Link
                        key={board._id}
                        to={`/board/${board._id}`}
                        className="group block"
                    >
                        <div className="h-44 glass-card hover:bg-muted/40 transition-all duration-300 rounded-2xl p-6 border border-border/50 hover:border-primary/50 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="text-primary" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Trello size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold font-outfit truncate pr-6">{board.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn(
                                                "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                                                board.visibility === 'team' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                            )}>
                                                {board.visibility === 'team' ? <Globe size={10} /> : <Lock size={10} />}
                                                {board.visibility}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Layout size={14} />
                                    <span className="truncate">In: {board.workspace?.name || 'Workspace'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[9px] font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground/60">Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredBoards.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-card rounded-2xl border border-dashed border-border">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
                            <Trello className="text-muted-foreground" size={40} />
                        </div>
                        <h3 className="text-xl font-bold font-outfit mb-2">No boards found</h3>
                        <p className="text-muted-foreground mb-6">Create a board inside a workspace to see it here.</p>
                        <Link to="/dashboard">
                            <Button>Go to Workspaces</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBoardsPage;
