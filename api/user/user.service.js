import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js';
import { ObjectId } from 'mongodb';

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    save,
}

const COLLECTION = 'user'

async function query() {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const users = await collection.find().toArray()
        users.forEach(user => delete user.password)
        return users
    } 
    catch(err) {
        loggerService.error(`Had problems getting users...`)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password
        return user
    } 
    catch (err) {
        loggerService.error(`Had problems getting user by id ${userId}...`)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const user = await collection.findOne({ username })
        delete user.password
        return user
    } 
    catch (err) {
        loggerService.error(`Had problems getting user by username ${username}...`)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const { acknowledged } = await collection.deleteOne({ _id: new ObjectId(userId) })
        return acknowledged ? `User ${userId} removed` : `Did not remove user ${userId}`
    } 
    catch (err) {
        loggerService.error(`Had problems removing user ${userId}...`)
        throw err
    }
}

async function save(userToSave) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        if(userToSave._id && userToSave._id.length > 0) {
            const userUpdate = {
                fullname: userToSave.fullname,
                score: userToSave.score,
            }
            const { acknowledged } = await collection.updateOne({ _id: new ObjectId(userToSave._id) }, { $set: userUpdate })
            return acknowledged ? userToSave : `Did not update user`
         } 
        else {
            const { acknowledged } = await collection.insertOne(userToSave)
            return acknowledged ? userToSave : `Did not add user`
        }
    } catch (err) {
        loggerService.error(`Had problems saving user ${userToSave._id}...`)
        throw err
    }
}


