// Bug CRUDL API
//import { authService } from '../auth/auth.service.js';
import { bugService } from './bug.service.js';

export const bugController = {
    getBugs,
    getBug,
    removeBug,
    addBug,
    updateBug
}

// List
export async function getBugs(req, res) {
    try {
        //const loggedinUser = authService.validateToken(req.cookies.loginToken)
        //console.log('loggedinUser', loggedinUser)

        // we don't want unknown (suspicious) stuff in the object, and we want to initialize missing stuff
        const filterBy = {
            title: req.query.title || '',
            minSeverity: +req.query.minSeverity || 0,
            label: req.query.label || '',
            pageIdx: req.query.pageIdx || undefined,
            userId: req.query.userId || '',
        }
        const sortObj = {
            sortBy: req.query.sortBy || '',
            isAscending: req.query.isAscending || "true"
        }
        const bugs = await bugService.query(filterBy, sortObj)
        res.send(bugs)
    } 
    catch (err) {
        console.log(err)
        res.status(400).send(`Couldn't get bugs -->  ` + err)
    }
}

// Read
export async function getBug(req, res) {
    try {
        const { bugId } = req.params
        const visitedBugs = JSON.parse(req.cookies.visitedBugs || JSON.stringify([]))
        if (visitedBugs.length > 0)
            console.log ("User visited the following bugs: ",visitedBugs)
        const bug = await bugService.getById(bugId)
        visitedBugs.push(bug._id)
        res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 7 * 1000 })
        if (visitedBugs.length > 3)
            res.status(401).send('Wait for a bit')
        else
            res.send(bug)
    } 
    catch (err) {
        res.status(400).send(`Couldn't get bug -->  ` + err)
        console.log(err)
    }
}


// Delete
export async function removeBug(req, res) {
    try {
        const { bugId } = req.params
        /*const loggedinUser = authService.validateToken(req.cookies.loginToken)
        if (!loggedinUser) 
            return res.status(401).send('Not authenticated')*/
        await bugService.remove(bugId, req.loggedinUser)
        res.send('Deleted OK')
    } 
    catch (err) {
        res.status(403).send(`Couldn't remove bug -->  ` + err)
        console.log(err)
    }
}


// Create
export async function addBug(req, res) {
    try {
        const { title, severity, description } = req.body
        //const bugToSave = { title, severity: +severity, description, labels: labels ? [...labels] : [] }  // *** test variations on this!!
        const bugToSave = { title, severity: +severity, description }  
        /*const loggedinUser = authService.validateToken(req.cookies.loginToken)
        if (!loggedinUser) 
            return res.status(401).send('Not authenticated')*/
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } 
    catch (err) {
        res.status(403).send(`Couldn't add bug -->  ` + err)
        console.log(err)
    }
}

// Update
export async function updateBug(req, res) {
    try {
        const { _id, title, severity, description, createdAt, creator } = req.body  // *** what if only part of them need to change and are sent??
        //const bugToSave = { _id, title, severity: +severity, description, labels: labels ? labels : [] }
        const bugToSave = { _id, title, severity: +severity, description, createdAt, creator }
        /*const loggedinUser = authService.validateToken(req.cookies.loginToken)
        if (!loggedinUser) 
            return res.status(401).send('Not authenticated')*/
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } 
    catch (err) {
        res.status(403).send(`Couldn't update bug -->  ` + err)
        console.log(err)
    }
}
