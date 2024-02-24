import { ObjectId } from 'mongodb';
import { loggerService } from '../../services/logger.service.js'
import { dbService } from '../../services/db.service.js';


export const bugService = {
    query,
    getById,
    remove,
    save,
}

const COLLECTION = 'bug'
const PAGE_SIZE = 3

async function query(filterBy = {}, sortObj = {}) {
    try {
        const collection = await dbService.getCollection(COLLECTION)

        const criteria = _buildCriteria(filterBy)
        const bugCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            let pageIdx = filterBy.pageIdx < 0 ? 0 : filterBy.pageIdx
            const lastDoc = collection.countDocuments - 1
            pageIdx = pageIdx > lastDoc ? lastDoc : pageIdx

            const startIdx = pageIdx * PAGE_SIZE
            bugCursor.skip(startIdx).limit(PAGE_SIZE)
        }
        if (sortObj.sortBy !== '') {
            const sortKey = sortObj.sortBy != 'createdAt' ? sortObj.sortBy : '_id'
            const sortDir = sortObj.isAscending == "true" ? 1 : -1
            bugCursor.collation({locale: "en" }).sort({[sortKey]: sortDir}) // the 'local' is for not being case sensitive
        }
    
        const bugs = bugCursor.toArray()
        return bugs
    } 
    catch(err) {
        loggerService.error(`Had problems getting bugs...`)
        throw err
    }
}

async function getById(bugId) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })
        return bug
    } 
    catch (err) {
        loggerService.error(`Had problems getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })

        if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) 
            throw ( 'You are not bug creator' )

        const { acknowledged } = await collection.deleteOne({ _id: new ObjectId(bugId) })
        return acknowledged ? `Bug ${bugId} removed` : `Did not remove bug ${bugId}`
    } 
    catch (err) {
        loggerService.error(`Had problems removing bug ${bugId}...`)
        throw err
    }
}

async function save(bugToSave, loggedinUser) {
    try {
        const collection = await dbService.getCollection(COLLECTION)
        if(bugToSave._id && bugToSave._id.length > 0) {
            if (!loggedinUser.isAdmin && bugToSave.creator._id !== loggedinUser?._id) 
                throw ('You are not bug creator')
            const bugUpdate = {
                title: bugToSave.title,
                severity: bugToSave.severity,
                description: bugToSave.description,
            }
            const { acknowledged } = await collection.updateOne({ _id: new ObjectId(bugToSave._id) }, { $set: bugUpdate })
            return acknowledged ? bugToSave : `Did not update bug`
         } 
        else {
            bugToSave.creator = {_id: loggedinUser._id, fullname:  loggedinUser.fullname}
            const { acknowledged } = await collection.insertOne(bugToSave)
            return acknowledged ? bugToSave : `Did not add bug`
        }
    } catch (err) {
        loggerService.error(`Had problems saving bug ${bugToSave._id}...`)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.title) {
        criteria.title = { $regex: filterBy.title, $options: 'i' }
    }

    if (filterBy.minSeverity) {
        criteria.severity = { $gt: filterBy.minSeverity }
    }

    /*if (filterBy.label) {
        criteria.labels = { $in: filterBy.label }
    }*/

    return criteria
}

