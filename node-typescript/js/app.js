'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
// routes
const todos_route_1 = __importDefault(require('./routes/todos.route'))
const app = (0, express_1.default)()
const port = 8080
app.use(express_1.default.json())
app.use('/todos', todos_route_1.default)
app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT: ${port}`)
})
