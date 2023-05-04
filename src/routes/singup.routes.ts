import { REFUSED } from 'dns'
import { Router, Request } from 'express'
import app from '../app'
import singup from '../services/Supabase/auth'

const router = Router()

var bodyParser = require('body-parser')

var cors = require('cors')
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true }))

router.post('/newuser/',cors(corsOptions),async (req, res)=>{
    const email = req.body.email
    const password = req.body.password
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const  newuser = await singup.createUser(email,password,first_name,last_name)
    res.send('Verfica tu email: '+email +'     Creado?'+newuser)
})

router.post('/login/',cors(corsOptions),async (req, res)=>{
    const email = req.body.email
    const password = req.body.password
    const  user = await singup.login(email,password)
    res.send(user)
})

export default router