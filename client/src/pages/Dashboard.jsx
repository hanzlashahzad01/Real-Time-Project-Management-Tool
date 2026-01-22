import React, { useEffect, useState } from 'react';
import { Plus, Trello, Users, Layout, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import CreateWorkspaceModal from '../components/layout/CreateWorkspaceModal';

const Dashboard = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            const res = await api.get('/workspaces');
            setWorkspaces(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-4">
                <div className="h-10 bg-muted/50 w-64 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-muted/30 rounded-2xl border border-border/50"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-outfit tracking-tight">Your Workspaces</h1>
                    <p className="text-muted-foreground mt-1">Select a workspace to manage your projects.</p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    Create Workspace
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map((item) => (
                    <Link
                        key={item.workspace._id}
                        to={`/workspace/${item.workspace._id}`}
                        className="group block"
                    >
                        <div className="h-full glass-card hover:bg-muted/40 transition-all duration-300 rounded-2xl p-6 border border-border/50 hover:border-primary/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="text-primary" />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Layout size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-outfit truncate pr-8">{item.workspace.name}</h3>
                                    <p className="text-sm text-muted-foreground">Role: {item.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Users size={16} />
                                    <span>{item.workspace.members.length} members</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>Last active: {new Date(item.workspace.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border/50 flex gap-2">
                                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/50 w-2/3 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {workspaces.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-card rounded-2xl border border-dashed border-border">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
                            <Plus className="text-muted-foreground" size={40} />
                        </div>
                        <h3 className="text-xl font-bold font-outfit mb-2">No workspaces found</h3>
                        <p className="text-muted-foreground mb-6">Create your first workspace to start collaborating.</p>
                        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Get Started</Button>
                    </div>
                )}
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchWorkspaces}
            />
        </div>
    );
};

export default Dashboard;
