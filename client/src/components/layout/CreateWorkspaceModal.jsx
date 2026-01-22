import React, { useState } from 'react';
import { X, Layout, Type, AlignLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../services/api';

const CreateWorkspaceModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return setError('Workspace name is required');

        setLoading(true);
        setError('');

        try {
            await api.post('/workspaces', { name, description });
            setName('');
            setDescription('');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create workspace');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Layout size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-outfit">New Workspace</h2>
                                <p className="text-xs text-muted-foreground">Kickstart your next big project.</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Type size={16} className="text-primary" /> Workspace Name
                            </label>
                            <Input
                                autoFocus
                                placeholder="e.g. Design Team, Q1 Roadmap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-muted/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <AlignLeft size={16} className="text-primary" /> Description
                            </label>
                            <textarea
                                placeholder="What is this workspace about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full min-h-[100px] bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                            <Button type="submit" disabled={loading} className="w-full gap-2 py-6 text-lg font-outfit">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                Create Workspace
                            </Button>
                            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkspaceModal;
