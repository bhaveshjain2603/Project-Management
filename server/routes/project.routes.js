import express from 'express';
const api = express.Router()

import { getProjects, getProjectById, createProject, updateProjectById, deleteProjectById } from '../controllers/project.controllers.js'

api.get('/projects', getProjects)

api.get('/project/:id', getProjectById)

api.post('/project', createProject)

api.put('/project/:id', updateProjectById)

api.delete('/project/:id', deleteProjectById)

// api.use('/project/:id/task', async (req, res, next) => {
//     if (req.method !== "GET") return next()

//     if (!req.params.id) return res.status(500).send(`server error`);

//     try {
//         const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { task: 1 })
//         return res.send(data)
//     } catch (error) {
//         return res.send(error)
//     }


// })


export default api