import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Miss-Bug-Secret')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}


function getLoginToken(user) {
    const jsonStr = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(jsonStr)
    return encryptedStr
}

function validateToken(token) {
    try {
        const jsonStr = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(jsonStr)
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
        //throw('Invalid login token')
    }
    return null // 'not-null' will be checked in middleware. thats why i commented out the 'throw' above...
}

async function login(username, password) {
    const user = await userService.getByUsername(username)
    if (!user) throw 'Unknown username'

    //  un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) throw 'Invalid username or password'

    // Removing passwords and personal data
    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }
    return miniUser

}

async function signup({ username, password, fullname }) {
    
    loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) throw 'Missing required signup information'
    
    const userExist = await userService.getByUsername(username)
    if (userExist) throw 'Username already taken'
    
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.save({ username, password: hash, fullname })
}