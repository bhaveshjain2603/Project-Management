import express from 'express';
const api = express.Router()

import { createUser, loginUser } from '../controllers/auth.controllers.js'

api.post('/signup', createUser);

api.post('/login', loginUser)

export default api