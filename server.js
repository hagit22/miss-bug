import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'


const app = express()
const port = process.env.PORT || 3032   // specifying port numbers - allows to differentiate between multiple services at one domain/address

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], // specifying localhost extension number (5173) enables multiple virtual domain/addresses for localhost
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, () => console.log(`Miss bug Server is ready for your requests! Listening on port ${port}!`))

