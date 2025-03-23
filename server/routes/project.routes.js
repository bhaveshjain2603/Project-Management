import express from 'express';
const api = express.Router()

import { getProjects, getProjectById, createProject, updateProjectById, deleteProjectById } from '../controllers/project.controllers.js'

api.get('/projects', getProjects)

api.get('/project/:id', getProjectById)

api.post('/project', createProject)

api.put('/project/:id', updateProjectById)

api.delete('/project/:id', deleteProjectById)

export default api
