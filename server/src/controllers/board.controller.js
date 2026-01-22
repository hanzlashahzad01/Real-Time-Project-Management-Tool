const Board = require('../models/Board');
const Workspace = require('../models/Workspace');
const List = require('../models/List');
const logActivity = require('../utils/activityLogger');

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
    const { name, workspaceId, visibility } = req.body;

    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        const board = await Board.create({
            name,
            workspace: workspaceId,
            visibility
        });

        // Initialize with default lists
        const defaultLists = ['To Do', 'In Progress', 'Done'];
        const listIds = [];

        for (const listName of defaultLists) {
            const list = await List.create({
                name: listName,
                board: board._id,
                order: listIds.length
            });
            listIds.push(list._id);
        }

        board.lists = listIds;
        await board.save();

        await logActivity({
            user: req.user._id,
            action: 'Board Created',
            board: board._id,
            workspace: workspaceId,
            details: `Created board "${name}"`
        });

        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all boards in a workspace
// @route   GET /api/boards/workspace/:workspaceId
// @access  Private
const getWorkspaceBoards = async (req, res) => {
    try {
        const boards = await Board.find({ workspace: req.params.workspaceId });
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get board details (with lists and cards)
// @route   GET /api/boards/:id
// @access  Private
const getBoardDetails = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate({
                path: 'lists',
                populate: {
                    path: 'cards',
                    options: { sort: { order: 1 } }
                }
            });

        if (!board) return res.status(404).json({ message: 'Board not found' });
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a list to board
// @route   POST /api/boards/:id/lists
// @access  Private
const addList = async (req, res) => {
    const { name } = req.body;
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        const newList = await List.create({
            name,
            board: board._id,
            order: board.lists.length
        });

        board.lists.push(newList._id);
        await board.save();

        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        // Delete associated lists and cards (simple cascade)
        await List.deleteMany({ board: board._id });
        // Cards should also be deleted if we want full cleanup
        // await Card.deleteMany({ board: board._id });

        await Board.findByIdAndDelete(req.params.id);
        res.json({ message: 'Board deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteList = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        // Remove from board's list array
        board.lists = board.lists.filter(l => l.toString() !== req.params.listId);
        await board.save();

        // Delete the list document
        await List.findByIdAndDelete(req.params.listId);
        // TODO: Also delete cards in this list

        res.json({ message: 'List deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBoard = async (req, res) => {
    const { name, visibility, description } = req.body;
    try {
        const board = await Board.findByIdAndUpdate(
            req.params.id,
            { name, visibility, description },
            { new: true }
        );
        if (!board) return res.status(404).json({ message: 'Board not found' });
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateList = async (req, res) => {
    const { name, order } = req.body;
    try {
        const list = await List.findByIdAndUpdate(
            req.params.listId,
            { name, order },
            { new: true }
        );
        if (!list) return res.status(404).json({ message: 'List not found' });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBoard,
    getWorkspaceBoards,
    getBoardDetails,
    addList,
    deleteBoard,
    deleteList,
    updateBoard,
    updateList
};
