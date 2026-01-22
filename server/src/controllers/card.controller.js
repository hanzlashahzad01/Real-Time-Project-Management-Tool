const Card = require('../models/Card');
const List = require('../models/List');
const logActivity = require('../utils/activityLogger');

// @desc    Create a new card
// @route   POST /api/cards
// @access  Private
const createCard = async (req, res) => {
    const { title, listId, boardId, description, priority, dueDate } = req.body;

    try {
        const list = await List.findById(listId);
        if (!list) return res.status(404).json({ message: 'List not found' });

        const cardCount = await Card.countDocuments({ list: listId });

        const card = await Card.create({
            title,
            list: listId,
            board: boardId,
            description,
            priority,
            dueDate,
            order: cardCount
        });

        list.cards.push(card._id);
        await list.save();

        await logActivity({
            user: req.user._id,
            action: 'Card Created',
            board: boardId,
            card: card._id,
            details: `Created card "${title}" in list "${list.name}"`
        });

        // Socket.io emit
        const io = req.app.get('io');
        io.to(boardId.toString()).emit('card_created', card);

        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
const updateCard = async (req, res) => {
    const { title, description, priority, dueDate, labels } = req.body;

    try {
        const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!card) return res.status(404).json({ message: 'Card not found' });

        await logActivity({
            user: req.user._id,
            action: 'Card Updated',
            board: card.board,
            card: card._id,
            details: `Updated card "${card.title}"`
        });

        // Socket.io emit
        const io = req.app.get('io');
        io.to(card.board.toString()).emit('card_updated', card);

        res.json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Move card (Drag & Drop)
// @route   POST /api/cards/move
// @access  Private
const moveCard = async (req, res) => {
    const { cardId, sourceListId, destinationListId, newIndex } = req.body;

    try {
        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        if (sourceListId === destinationListId) {
            // Reordering in same list
            const list = await List.findById(sourceListId);
            list.cards.splice(list.cards.indexOf(cardId), 1);
            list.cards.splice(newIndex, 0, cardId);
            await list.save();
        } else {
            // Moving to another list
            const sourceList = await List.findById(sourceListId);
            const destList = await List.findById(destinationListId);

            sourceList.cards.splice(sourceList.cards.indexOf(cardId), 1);
            destList.cards.splice(newIndex, 0, cardId);

            card.list = destinationListId;

            await sourceList.save();
            await destList.save();
            await card.save();
        }

        await logActivity({
            user: req.user._id,
            action: 'Card Moved',
            board: card.board,
            card: card._id,
            details: `Moved card "${card.title}"`
        });

        // Socket.io emit
        const io = req.app.get('io');
        io.to(card.board.toString()).emit('card_moved', { cardId, sourceListId, destinationListId, newIndex });

        res.json({ message: 'Card moved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to card
// @route   POST /api/cards/:id/comments
// @access  Private
const addComment = async (req, res) => {
    const { text } = req.body;

    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        const comment = {
            user: req.user._id,
            text,
            createdAt: new Date()
        };

        card.comments.push(comment);
        await card.save();

        // Populate user info for the new comment
        const updatedCard = await Card.findById(card._id).populate('comments.user', 'name avatar');
        const newComment = updatedCard.comments[updatedCard.comments.length - 1];

        // Socket.io emit
        const io = req.app.get('io');
        io.to(card.board.toString()).emit('comment_added', { cardId: card._id, comment: newComment });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found' });

        // Remove from list
        await List.findByIdAndUpdate(card.list, {
            $pull: { cards: card._id }
        });

        await Card.findByIdAndDelete(req.params.id);

        await logActivity({
            user: req.user._id,
            action: 'Card Deleted',
            board: card.board,
            details: `Deleted card "${card.title}"`
        });

        // Socket.io emit
        const io = req.app.get('io');
        io.to(card.board.toString()).emit('card_deleted', { cardId: card._id, listId: card.list });

        res.json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCard,
    updateCard,
    moveCard,
    addComment,
    deleteCard
};
