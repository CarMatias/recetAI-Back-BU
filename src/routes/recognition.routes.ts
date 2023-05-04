import { Router, Request } from 'express'
import { RecognizedIngredient } from '../schema/Ingredient'
import clarifai from '../services/Recognition/clarifai'
import localTranslate from '../services/Translate/localTranslate'

const router = Router()

router.post('/recognition', async (req: Request<unknown, unknown, { imgBase64?: string }>, res) => {
  try {
    if (req.body.imgBase64) {
      const trimmedImg = req.body.imgBase64.replace(/^data:image\/[a-z]+;base64,/, '')
      const clarifaiRes = await clarifai.recognize(trimmedImg)
      const translatedRes = clarifaiRes.map<RecognizedIngredient>((item) => ({
        ...item,
        name: localTranslate.translate(item.name, 'es'),
      }))
      res.send({ data: translatedRes })
    } else {
      res.status(400).send({ message: 'No image provided' })
    }
  } catch (e) {
    res.status(500).send({ message: `Internal server error ${e}` })
  }
})

export default router
