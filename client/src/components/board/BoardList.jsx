import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import CardItem from './CardItem';
import { Plus, MoreVertical, X, Check, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

const BoardList = ({ list, onAddCard, onDeleteList, onDeleteCard, onUpdateCard, onUpdateList }) => {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleAddCard = () => {
        if (newCardTitle.trim()) {
            onAddCard(list._id, newCardTitle);
            setNewCardTitle('');
            setIsAddingCard(false);
        }
    };

    return (
        <div className="w-[300px] flex-shrink-0 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-2 relative">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm tracking-wide uppercase text-muted-foreground">
                        {list.name}
                    </h3>
                    <span className="bg-muted px-2 py-0.5 rounded-full text-[10px] font-bold text-muted-foreground">
                        {list.cards?.length || 0}
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-md transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                            <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl z-50 border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        const newName = prompt('Enter new list name:', list.name);
                                        if (newName && newName !== list.name) {
                                            // Handle rename logic - needs a function from parent
                                            if (onUpdateList) {
                                                onUpdateList(list._id, { name: newName });
                                            } else {
                                                alert('Rename functionality needs wiring in the parent.');
                                            }
                                        }
                                    }}
                                >
                                    <Edit size={16} />
                                    Rename List
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        if (window.confirm('Are you sure you want to delete this list?')) {
                                            onDeleteList(list._id);
                                        }
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete List
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Droppable droppableId={list._id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                            "flex-1 overflow-y-auto px-2 min-h-[10px] custom-scrollbar transition-colors rounded-xl",
                            snapshot.isDraggingOver && "bg-primary/5 ring-2 ring-primary/20"
                        )}
                    >
                        {list.cards?.map((card, index) => (
                            <CardItem
                                key={card._id}
                                card={card}
                                index={index}
                                onDelete={onDeleteCard}
                                onUpdate={onUpdateCard}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className="mt-4 px-2 pb-2">
                {isAddingCard ? (
                    <div className="glass-card p-3 rounded-xl animate-fade-in shadow-xl ring-1 ring-primary/20">
                        <Input
                            autoFocus
                            placeholder="Enter card title..."
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            className="mb-3 bg-background"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                        />
                        <div className="flex items-center justify-between">
                            <Button size="sm" className="h-8 px-4" onClick={handleAddCard}>
                                Add Card
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                onClick={() => setIsAddingCard(false)}
                            >
                                <X size={18} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="flex items-center gap-2 w-full p-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                        <Plus size={16} />
                        Add a card
                    </button>
                )}
            </div>
        </div>
    );
};

export default BoardList;
