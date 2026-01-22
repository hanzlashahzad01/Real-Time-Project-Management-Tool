import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trello, Users, Settings, Layout, ChevronRight, Loader2 } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import CreateBoardModal from '../components/board/CreateBoardModal';
import MembersModal from '../components/layout/MembersModal';

const WorkspaceDetail = () => {
    const { workspaceId } = useParams();
    const [boards, setBoards] = useState([]);
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

    const fetchWorkspaceData = async () => {
        try {
            setLoading(true);
            const boardsRes = await api.get(`/boards/workspace/${workspaceId}`);
            setBoards(boardsRes.data);
            // Optional: Fetch workspace info if needed
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaceData();
    }, [workspaceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                        <Layout size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-outfit tracking-tight">Workspace Boards</h1>
                        <p className="text-muted-foreground mt-1">Manage your team's projects and tasks.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2" onClick={() => setIsMembersModalOpen(true)}>
                        <Users size={18} />
                        Members
                    </Button>
                    <Button className="gap-2" onClick={() => setIsBoardModalOpen(true)}>
                        <Plus size={20} />
                        Create Board
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <Link
                        key={board._id}
                        to={`/board/${board._id}`}
                        className="group block"
                    >
                        <div className="h-40 glass-card hover:bg-muted/40 transition-all duration-300 rounded-2xl p-6 border border-border/50 hover:border-primary/50 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="text-primary" />
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Trello size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold font-outfit truncate pr-6">{board.name}</h3>
                                    <span className={cn(
                                        "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                                        board.visibility === 'team' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                    )}>
                                        {board.visibility}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs text-muted-foreground">Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </Link>
                ))}

                {boards.length === 0 && (
                    <div className="col-span-full py-16 text-center glass-card rounded-2xl border border-dashed border-border">
                        <Trello className="text-muted-foreground mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold font-outfit mb-2">No boards yet</h3>
                        <p className="text-muted-foreground mb-6">Create a board to start organizing your tasks.</p>
                        <Button variant="primary" onClick={() => setIsBoardModalOpen(true)}>Create First Board</Button>
                    </div>
                )}
            </div>

            <CreateBoardModal
                isOpen={isBoardModalOpen}
                onClose={() => setIsBoardModalOpen(false)}
                workspaceId={workspaceId}
                onSuccess={fetchWorkspaceData}
            />

            <MembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                workspaceId={workspaceId}
            />
        </div>
    );
};

export default WorkspaceDetail;
