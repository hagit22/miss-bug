import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const BUG_FILE_NAME = './data/bug.json'
var bugs = utilService.readJsonFile(BUG_FILE_NAME)
const PAGE_SIZE = 3

async function query(filterBy = {}, sortObj = {}) {
    try {
        let filteredBugs = [...bugs]
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        if (filterBy.label) {
            filteredBugs = filteredBugs.filter(bug => bug.labels && bug.labels.includes(filterBy.label))
        }
        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        if (filterBy.userId) {
            filteredBugs = filteredBugs.filter(bug => bug.creator._id == filterBy.userId)
        }
        if (sortObj.sortBy !== '') {
            const sortKey = sortObj.sortBy;
            const sortDir = sortObj.isAscending == "true" ? 1 : -1
            filteredBugs = filteredBugs.sort((a,b) => 
                (utilService.toLowerCaseAllowEmpty(a[sortKey]) > utilService.toLowerCaseAllowEmpty(b[sortKey]) ? 1 : -1) * sortDir);
        }
        return filteredBugs
    } 
    catch(err) {
        loggerService.error(`Had problems getting bugs...`)
        throw err
    }
}

async function getById(bugId) {
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        return bug
    } 
    catch (err) {
        loggerService.error(`Had problems getting bug ${bugId}...`)
        throw err
    }
}

async function remove(bugId, loggedinUser) {
    try {
        const index = bugs.findIndex(bug => bug._id === bugId)
        const bug = bugs[index]
        if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) 
            throw ( 'You are not bug creator' )
        bugs.splice(index, 1)
        utilService.saveEntitiesToFile(bugs, BUG_FILE_NAME)
        return `Bug ${bugId} removed`
    } 
    catch (err) {
        loggerService.error(`Had problems removing bug ${bugId}...`)
        throw err
    }
}

async function save(bugToSave, loggedinUser) {
    try {
        if(bugToSave._id && bugToSave._id.length > 0) {
            const index = bugs.findIndex(bug => bug._id === bugToSave._id)
            if(index === -1) 
                throw 'Bad Id'
            //bugToSave.createdAt = new Date(Date.now()).toISOString()
            const bug = bugs[index]
            if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser?._id) 
                throw ('You are not bug creator')
            bugs.splice(index, 1, bugToSave)
        } 
        else {
            bugToSave._id = utilService.makeId()
            bugToSave.createdAt = new Date(Date.now()).toISOString()
            bugToSave.creator = { _id: loggedinUser._id, fullname: loggedinUser.fullname }
            bugs.push(bugToSave)
        }
        utilService.saveEntitiesToFile(bugs, BUG_FILE_NAME)
    } catch (err) {
        loggerService.error(`Had problems saving bug ${bugToSave._id}...`)
        throw err
    }
    return bugToSave
}

