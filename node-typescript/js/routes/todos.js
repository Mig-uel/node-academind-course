"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// models
const todos_1 = require("../models/todos");
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
    return res.status(200).json({ todos: todos_1.todos });
});
router.post('/', (req, res, next) => {
    const { text } = req.body;
    const newTodo = { id: '1', text };
    todos_1.todos.push(newTodo);
    return res.status(201).json({ message: 'Todo added!' });
});
exports.default = router;
