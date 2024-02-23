import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save,
}

const USER_FILE_NAME = './data/user.json'
var users = utilService.readJsonFile(USER_FILE_NAME)

async function query() {
    try {
        return users
    } 
    catch(err) {
        loggerService.error(`Had problems getting users...`)
        throw err
    }
}

async function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        return user
    } 
    catch (err) {
        loggerService.error(`Had problems getting user by id ${userId}...`)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const user = users.find(user => user.username === username)
        return user
    } 
    catch (err) {
        loggerService.error(`Had problems getting user by username ${username}...`)
        throw err
    }
}

async function remove(userId) {
    const index = users.findIndex(user => user._id === userId)
    users.splice(index, 1)
    try {
        utilService.saveEntitiesToFile(users, USER_FILE_NAME)
    } 
    catch (err) {
        loggerService.error(`Had problems removing user ${userId}...`)
        throw err
    }
    return `User ${userId} removed`
}

async function save(userToSave) {
    try {
        if(userToSave._id && userToSave._id.length > 0) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if(idx === -1) throw 'Bad Id'
            userToSave.createdAt = new Date(Date.now()).toISOString()
            users.splice(idx, 1, userToSave)
        } 
        else {
            userToSave._id = utilService.makeId()
            userToSave.createdAt = new Date(Date.now()).toISOString()
            users.push(userToSave)
        }
        utilService.saveEntitiesToFile(users, USER_FILE_NAME)
    } catch (err) {
        loggerService.error(`Had problems saving user ${userToSave._id}...`)
        throw err
    }
    return userToSave
}

