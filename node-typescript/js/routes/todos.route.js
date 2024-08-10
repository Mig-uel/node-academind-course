"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
let todos = [];
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    return res.status(200).json({ todos });
});
router.post('/', (req, res, next) => {
    const { text } = req.body;
    const newTodo = { id: new Date().getTime(), text };
    todos.push(newTodo);
    return res.status(201).json({ message: 'Todo added!', todos });
});
router.patch('/:id', (req, res, next) => {
    const { id } = req.params;
    const { text } = req.body;
    const todoIndex = todos.findIndex((todo) => todo.id === +id);
    if (!todoIndex)
        return res.status(404).json({ error: 'Todo not found.' });
    todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { text });
    return res.status(200).json({ message: 'Updated todo.', todos });
});
router.delete('/delete/:id', (req, res, next) => {
    const { id } = req.params;
    const todo = todos.find((todo) => todo.id === +id);
    if (!todo)
        return res.status(404).json({ error: 'Todo not found.' });
    todos = todos.filter((todo) => todo.id !== +id);
});
exports.default = router;
