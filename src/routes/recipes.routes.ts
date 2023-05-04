import { Router, Request } from 'express'
import edamam from '../services/Recipes/edamam'
import googleTranslate from '../services/Translate/googleTranslate'
import mockTranslate from '../services/Translate/mockTranslate'

const translationService = googleTranslate

const cont = 0
const router = Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

type Filters = {
  health: string[]
  timeToCook: number
}

router.post<any, any, any, { data: string[]; filters: Filters }>(
  '/recipes',
  cors(corsOptions),
  async (req, res) => {
    const { data, filters } = req.body
    const translatedIngredientsPromise = translationService.translate(data.join(', '), 'en')
    const translatedIngredients = (await translatedIngredientsPromise).split(', ')
    const edamamRes = await edamam.getRecipes(translatedIngredients, filters)
    res.send(edamamRes)
  }
)

router.get('/getrandom', cors(corsOptions), async (req, res) => {
  const edamamRes = await edamam.getRandomRecipe()
  res.send(edamamRes)
})

router.post('/getrecipebycategory',cors(corsOptions), async(req,res)=>{
  const category = req.body.category
  const recipe = await edamam. getRandomRecipeByCategory(category)
  console.log("DEVOLVEMOS DESSERT")
  if(recipe != undefined){
    res.status(200).send(recipe)
  }else{
    res.status(400).send("No se pudo conectar con el servicio de recetas")
  }
})

router.post<
  unknown,
  unknown,
  {
    userId: string
    recipeId: string
  }
>('/saved', cors(corsOptions), async (req, res) => {
  try {
    const { recipeId, userId } = req.body
    const edamamRes = await edamam.saveRecipe(recipeId, userId)
    return res.status(200).send(recipeId)
  } catch (e) {
    return res.status(500).send(e)
  }
})

router.get('/saved', cors(corsOptions), async (req, res) => {
  try {
    const userId = req.query.userId as string
    const edamamRes = await edamam.getSavedRecipes(userId)
    res.status(200).send(edamamRes)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

export default router
