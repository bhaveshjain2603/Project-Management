import joi from 'joi';
import mongoose from 'mongoose';
import Project from '../models/project.model.js'

export const createTaskByProjectId = async (req, res) => {
    if (!req.params.id) return res.status(500).send(`server error`);

    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        topic: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    const { error, value } = task.validate({ title: req.body.title, topic: req.body.topic, description: req.body.description });
    if (error) return res.status(422).send(error)

    try {
        const [{ task }] = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { "task.index": 1 }).sort({ 'task.index': 1 })
        let countTaskLength = [task.length, task.length > 0 ? Math.max(...task.map(o => o.index)) : task.length];

        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $push: { task: { ...value, stage: "Requested", order: countTaskLength[0], index: countTaskLength[1] + 1 } } })
        return res.send(data)
    } catch (error) {
        return res.status(500).send(error)
    }
}

export const getTaskById = async (req, res) => {
    try {
        const { id, taskId } = req.params;  // ✅ Correct params

        console.log("Fetching project:", id);
        console.log("Fetching task:", taskId);

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        console.log("Project found:", project);

        // ✅ Ensure tasks are populated if stored as references
        const task = project.task.find(t => t._id.toString() === taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        console.log("Task found:", task);

        res.status(200).json({ 
            title: task.title,
            topic: task.topic,
            description: task.description,
            createdAt: task.createdAt || 'N/A'  
        });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};



export const updateTaskById = async (req, res) => {

    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    const task = joi.object({
        title: joi.string().min(3).max(30).required(),
        topic: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    })

    const { error, value } = task.validate({ title: req.body.title, topic: req.body.topic, description: req.body.description });
    if (error) return res.status(422).send(error)

    try {
        const data = await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.taskId) } }
        }, { $set: { "task.$.title": value.title, "task.$.topic": value.topic, "task.$.description": value.description } })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
}

export const deleteTaskById = async (req, res) => {
    if (!req.params.id || !req.params.taskId) return res.status(500).send(`server error`);

    try {
        const data = await Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $pull: { task: { _id: mongoose.Types.ObjectId(req.params.taskId) } } })
        return res.send(data)
    } catch (error) {
        return res.send(error)
    }
}

export const updateTaskToDo = async (req, res) => {
    let todo = []

    for (const key in req.body) {
        // todo.push({ items: req.body[key].items, name: req.body[key]?.name })
        for (const index in req.body[key].items) {
            req.body[key].items[index].stage = req.body[key].name
            todo.push({ name: req.body[key].items[index]._id, stage: req.body[key].items[index].stage, order: index })
        }
    }

    todo.map(async (item) => {
        await Project.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } }
        }, { $set: { "task.$.order": item.order, "task.$.stage": item.stage } })
    })

    res.send(todo)
}

export default { createTaskByProjectId, updateTaskById, getTaskById, deleteTaskById, updateTaskToDo }