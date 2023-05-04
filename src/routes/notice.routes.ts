import { Router, Request } from 'express'
import noticeService from '../services/Notice'


let cont = 0
const router = Router()
var bodyParser = require('body-parser')
var cors = require('cors')
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true }))

router.post('/newnotice',cors(corsOptions),async (req, res)=>{
  const {notice,hour,day,id_user} = req.body.data
  const newNotice = await noticeService.newNotice(notice,hour,day,id_user)
  if(newNotice != undefined){
    res.status(200).send("Notificacion agregada correctamente!")
  }else{
  res.status(400).send("Error al cargar la receta")
    }
})

router.post('/getnotice',cors(corsOptions),async (req, res)=>{
    const id_user = req.body.id_user
    const notice = await noticeService.getMyNotice(id_user)
    if(notice != undefined){
        console.log("andamos")

        res.status(200).send(notice)
    }else{
    res.status(400)
      }
  })

export default router
