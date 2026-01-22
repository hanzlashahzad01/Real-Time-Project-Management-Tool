import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import {
    Loader2,
    Settings,
    Users,
    Share2,
    Filter,
    Search,
    MoreHorizontal,
    Plus,
    Trash2,
    X
} from 'lucide-react';
import api from '../services/api';
import socketService from '../services/socket';
import BoardList from '../components/board/BoardList';
import { Button } from '../components/ui/Button';

const BoardPage = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAddList, setShowAddList] = useState(false);
    const [newListName, setNewListName] = useState('');

    const fetchBoardDetails = useCallback(async () => {
        try {
            const res = await api.get(`/boards/${boardId}`);
            setBoard(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        if (!boardId) return;
        fetchBoardDetails();
        socketService.joinRoom(boardId);

        socketService.on('card_created', (newCard) => {
            setBoard(prev => {
                if (!prev || !prev.lists) return prev;
                const newLists = prev.lists.map(list => {
                    if (list._id === newCard.list) {
                        return { ...list, cards: [...(list.cards || []), newCard] };
                    }
                    return list;
                });
                return { ...prev, lists: newLists };
            });
        });

        socketService.on('card_deleted', ({ cardId, listId }) => {
            setBoard(prev => {
                if (!prev || !prev.lists) return prev;
                const newLists = prev.lists.map(list => {
                    if (list._id === listId) {
                        return { ...list, cards: (list.cards || []).filter(c => c._id !== cardId) };
                    }
                    return list;
                });
                return { ...prev, lists: newLists };
            });
        });

        return () => {
            socketService.off('card_created');
            socketService.off('card_deleted');
        };
    }, [boardId, fetchBoardDetails]);

    const handleDeleteCard = async (cardId) => {
        try {
            await api.delete(`/cards/${cardId}`);
            // No need for manual state update if socket works, but good for fallback
            setBoard(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    cards: list.cards.filter(c => c._id !== cardId)
                }));
                return { ...prev, lists: newLists };
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateCard = async (cardId, data) => {
        try {
            const res = await api.put(`/cards/${cardId}`, data);
            setBoard(prev => {
                const newLists = prev.lists.map(list => ({
                    ...list,
                    cards: list.cards.map(c => c._id === cardId ? res.data : c)
                }));
                return { ...prev, lists: newLists };
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddList = async () => {
        if (!newListName.trim()) return;
        try {
            const res = await api.post(`/boards/${boardId}/lists`, { name: newListName });
            setBoard(prev => ({
                ...prev,
                lists: [...(prev.lists || []), { ...res.data, cards: [] }]
            }));
            setNewListName('');
            setShowAddList(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBoard = async () => {
        if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) return;
        try {
            setLoading(true);
            await api.delete(`/boards/${boardId}`);
            navigate('/dashboard');
        } catch (err) {
            console.error('Delete board failed:', err);
            alert('Failed to delete board');
            setLoading(false);
        }
    };

    const handleRenameBoard = async () => {
        const newName = prompt('Enter new board name:', board.name);
        if (newName && newName !== board.name) {
            try {
                // Assuming we have a PUT /api/boards/:id route. Let's check routes.
                await api.put(`/boards/${boardId}`, { name: newName });
                setBoard(prev => ({ ...prev, name: newName }));
            } catch (err) {
                console.error('Rename board failed:', err);
                alert('Failed to rename board');
            }
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceListId = source.droppableId;
        const destinationListId = destination.droppableId;
        const newIndex = destination.index;

        try {
            await api.post('/cards/move', {
                cardId: draggableId,
                sourceListId,
                destinationListId,
                newIndex
            });
            fetchBoardDetails();
        } catch (err) {
            console.error('Failed to move card:', err);
            fetchBoardDetails();
        }
    };

    const handleAddCard = async (listId, title) => {
        try {
            await api.post('/cards', {
                title,
                listId,
                boardId
            });
            fetchBoardDetails();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteList = async (listId) => {
        if (!window.confirm('Are you sure you want to delete this list?')) return;
        try {
            await api.delete(`/boards/${boardId}/lists/${listId}`);
            setBoard(prev => ({
                ...prev,
                lists: prev.lists.filter(l => l._id !== listId)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateList = async (listId, data) => {
        try {
            const res = await api.put(`/boards/${boardId}/lists/${listId}`, data);
            setBoard(prev => ({
                ...prev,
                lists: prev.lists.map(list => list._id === listId ? { ...list, ...res.data } : list)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!board) return <div className="p-8 text-center">Board not found or you don't have access.</div>;

    // Filtering logic with safety checks
    const filteredLists = (board.lists || []).map(list => ({
        ...list,
        cards: (list.cards || []).filter(card =>
            card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    return (
        <div className="flex flex-col h-full overflow-hidden text-foreground">
            {/* Board Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold font-outfit tracking-tight">{board.name}</h1>
                    <div className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-lg border border-border/50">
                        <div className="flex -space-x-1.5 overflow-hidden">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-background/50 bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                                    U{i}
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                            <Share2 size={12} />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter cards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-muted/30 border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 w-40 transition-all focus:w-64 text-foreground"
                        />
                    </div>

                    <div className="relative">
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <MoreHorizontal size={20} />
                        </Button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl z-50 border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleDeleteBoard();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete Board
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleRenameBoard();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Settings size={16} />
                                        Board Settings
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full items-start">
                        {filteredLists.map((list) => (
                            <BoardList
                                key={list._id}
                                list={list}
                                onAddCard={handleAddCard}
                                onDeleteCard={handleDeleteCard}
                                onUpdateCard={handleUpdateCard}
                                onDeleteList={handleDeleteList}
                                onUpdateList={handleUpdateList}
                            />
                        ))}

                        {showAddList ? (
                            <div className="w-[300px] flex-shrink-0 glass-card rounded-2xl p-4 border border-primary/50 animate-in slide-in-from-right-4 duration-200">
                                <input
                                    autoFocus
                                    placeholder="Enter list title..."
                                    className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleAddList}>Add List</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setShowAddList(false)}><X size={18} /></Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddList(true)}
                                className="w-[300px] flex-shrink-0 bg-muted/20 hover:bg-muted/40 border border-dashed border-border rounded-2xl h-14 flex items-center justify-center gap-2 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary group"
                            >
                                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Add another list</span>
                            </button>
                        )}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default BoardPage;
