import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Calendar, MessageSquare, Paperclip, Clock, Trash2, Edit } from 'lucide-react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

const CardItem = ({ card, index, onDelete, onUpdate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const priorityColors = {
        Low: 'bg-blue-500/20 text-blue-500',
        Medium: 'bg-yellow-500/20 text-yellow-500',
        High: 'bg-red-500/20 text-red-500',
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this card?')) {
            onDelete(card._id);
            setIsMenuOpen(false);
        }
    };

    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newTitle = prompt('Enter new card title:', card.title);
        if (newTitle && newTitle !== card.title) {
            onUpdate(card._id, { title: newTitle });
        }
        setIsMenuOpen(false);
    };

    return (
        <Draggable draggableId={card._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "group bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-xl p-4 mb-3 transition-all duration-200 shadow-sm hover:shadow-md",
                        snapshot.isDragging && "shadow-2xl ring-2 ring-primary bg-muted/80 scale-[1.02] rotate-2"
                    )}
                >
                    <div className="flex items-start justify-between mb-3 relative">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            priorityColors[card.priority] || priorityColors.Medium
                        )}>
                            {card.priority || 'Medium'}
                        </span>

                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded-md"
                            >
                                <MoreHorizontal size={16} />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-36 glass-card rounded-xl shadow-xl z-50 border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                                            onClick={handleEdit}
                                        >
                                            <Edit size={14} />
                                            Edit Card
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 size={14} />
                                            Delete Card
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <h4 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {card.title}
                    </h4>

                    {card.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                            {card.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                        <div className="flex items-center gap-3">
                            {card.dueDate && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                    <Clock size={10} />
                                    <span>{format(new Date(card.dueDate), 'MMM d')}</span>
                                </div>
                            )}
                            {card.comments?.length > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <MessageSquare size={10} />
                                    <span>{card.comments.length}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex -space-x-1.5">
                            {card.assignedTo?.map((user, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                                    {user.name?.[0] || 'U'}
                                </div>
                            ))}
                            {(!card.assignedTo || card.assignedTo.length === 0) && (
                                <div className="w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center text-[8px] text-muted-foreground">
                                    +
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default CardItem;
