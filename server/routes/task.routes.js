import express from 'express';
const api = express.Router()

import { createTaskByProjectId, updateTaskById, getTaskById, deleteTaskById, updateTaskToDo } from '../controllers/task.controllers.js'

api.post('/project/:id/task', createTaskByProjectId)

api.get('/project/:id/task/:taskId', getTaskById)

api.put('/project/:id/task/:taskId', updateTaskById)

api.delete('/project/:id/task/:taskId', deleteTaskById)

api.put('/project/:id/todo', updateTaskToDo)

export default api
