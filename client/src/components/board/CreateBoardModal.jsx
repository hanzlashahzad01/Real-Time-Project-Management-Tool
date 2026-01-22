import React, { useState } from 'react';
import { X, Trello, Type, Eye, Lock, Globe, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../services/api';

const CreateBoardModal = ({ isOpen, onClose, workspaceId, onSuccess }) => {
    const [name, setName] = useState('');
    const [visibility, setVisibility] = useState('team');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return setError('Board name is required');

        setLoading(true);
        setError('');

        try {
            await api.post('/boards', {
                name,
                workspaceId,
                visibility
            });
            setName('');
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create board');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Trello size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold font-outfit">Create Board</h2>
                                <p className="text-xs text-muted-foreground">Boards house your lists and cards.</p>
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
                                <Type size={16} className="text-primary" /> Board Name
                            </label>
                            <Input
                                autoFocus
                                placeholder="e.g. Project Roadmap, Spring Sprint"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-muted/30"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 mb-3">
                                <Eye size={16} className="text-primary" /> Visibility
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setVisibility('team')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${visibility === 'team'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                                        }`}
                                >
                                    <Globe size={20} />
                                    <span className="text-xs font-bold">Team</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVisibility('private')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${visibility === 'private'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80'
                                        }`}
                                >
                                    <Lock size={20} />
                                    <span className="text-xs font-bold">Private</span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                            <Button type="submit" disabled={loading} className="w-full gap-2 py-6 text-lg font-outfit">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                Create Board
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateBoardModal;
