// User CRUDL API
import { userService } from './user.service.js';

export const userController = {
    getUsers,
    getUser,
    removeUser,
    addUser,
    updateUser
}

// List
export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } 
    catch (err) {
        res.status(400).send(`Couldn't get users --> (Server Error Message)s` + err)
        console.log(err.message)
    }
}

// Read
export async function getUser(req, res) {
    try {
        const { userId } = req.params
        const user = await userService.getById(userId)
        res.send(user)
    } 
    catch (err) {
        res.status(400).send(`Couldn't get user` + err)
        console.log(err.message)
    }
}


// Delete
export async function removeUser(req, res) {
    try {
        const { userId } = req.params
        await userService.remove(userId)
        res.send('Deleted OK')
    } 
    catch (err) {
        res.status(400).send(`Couldn't remove user` + err)
        console.log(err.message)
    }
}


// Create
export async function addUser(req, res) {
    try {
        const { fullname, username, password, score } = req.body
        const userToSave = { fullname, username, password, score: +score, isAdmin: false }  
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } 
    catch (err) {
        res.status(400).send(`Couldn't add user` + err)
        console.log(err.message)
    }
}

// Update
export async function updateUser(req, res) {
    try {
        const { _id, fullname, username, password, score, isAdmin } = req.body  
        const userToSave = { _id, fullname, username, password, score: +score, isAdmin }
        const savedUser = await userService.save(userToSave)
        res.send(savedUser)
    } 
    catch (err) {
        res.status(400).send(`Couldn't update user` + err)
        console.log(err.message)
    }
}
