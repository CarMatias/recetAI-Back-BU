import axios from 'axios'
import { supabase } from '../Supabase/client'
import googleTranslate from '../Translate/googleTranslate'
import mockTranslate from '../Translate/mockTranslate'
import ingredients from './ingredientsEN.json'

const APP_ID = '0eac652e'
const APP_KEY = '799af51ff362f25a924ec302f2b80bde'

const API_BASE_URL = 'https://api.edamam.com/api/recipes/v2'

function ApiUrlGetter(query: string) {
  return API_BASE_URL + '?type=public&q=' + query + '&app_id=' + APP_ID + '&app_key=' + APP_KEY
}

function ApiUrlGetterId(id: string) {
  return API_BASE_URL + '/' + id + '?type=public' + '&app_id=' + APP_ID + '&app_key=' + APP_KEY
}

async function translateLabel(name: string) {
  return await googleTranslate.translate(name, 'es')
}

const translateFoodIng = async (food: string) => {
  return await googleTranslate.translate(food, 'es')
}

const createRecipe = async (recipe: any) => {
  const nameTranslate = await translateLabel(recipe.label)
  const resultRecipe = {
    id: recipe.externalId,
    name: nameTranslate,
    calories: Math.trunc(recipe?.calories),
    link: recipe?.url,
    image: recipe?.image,
    tags: recipe?.healthLabels,
    ingredients: await Promise.all(
      recipe?.ingredients.map(async (ing: any) => ({
        food: await translateFoodIng(ing.food),
        quantity: ing?.quantity,
        measure: ing?.measure,
      }))
    ),
    macronutrients: {
      protein: recipe?.digest.filter((value: any) => {
        if (value.label == 'Protein') return value.daily
      })[0]?.daily,
      carbs: recipe?.digest.filter((value: any) => {
        if (value.label == 'Carbs') return value.daily
      })[0]?.daily,
      fat: recipe?.digest.filter((value: any) => {
        if (value.label == 'Fat') return value.daily
      })[0]?.daily,
    },

    timeToCook: recipe?.totalTime,
    serves: recipe?.yield,
  }
  return resultRecipe
}
const eliminaDuplicados = (arr:number[]) => {
  let unicos: any[] = []
  for(let i = 0; i < arr.length; i++) {
 
    let elemento = arr[i];
  
    if (!unicos.includes(arr[i])) {
      unicos.push(elemento);
    }
  }
  return unicos
}

const postTags = async (tags: string[]) => {
  const { data: existentTagsData, error } = await supabase.from('tags').select('*').in('name', tags)
  if (error) {
    console.log(error)
  }
  if (existentTagsData) {
    const tagsId = existentTagsData.map((tag) => tag.id)
    const tagsToPost = tags.filter((tag) => !tagsId.includes(tag))
    const { data, error } = await supabase.from('tags').insert(tagsToPost).select('id')
    if (error) {
      console.log(error)
    }
    if (data) {
      return [...data.map((tag) => tag.id), ...tagsId]
    }
    return tagsId
  }
  return []
}

const postIngredients = async (ingredients: any[]) => {
  const { data: existentIngredientsData, error } = await supabase
    .from('ingredient')
    .select('*')
    .in('name', ingredients)
  if (error) {
    console.log(error)
  }
  if (existentIngredientsData) {
    const ingredientsId = existentIngredientsData.map((ingredient) => ingredient.id)
    const ingredientsToPost = ingredients.filter((ingredient) => !ingredientsId.includes(ingredient))
    const { data, error } = await supabase.from('ingredient').insert(ingredientsToPost).select('id')
    if (error) {
      console.log(error)
    }
    if (data) {
      return [...data.map((ingredient) => ingredient.id), ...ingredientsId]
    }
    return ingredientsId
  }
  return []
}

type Filters =
  | {
      health?: string[]
      timeToCook?: number
    }
  | undefined
  
class EdamamService {
  async getRecipes(params: string[], filters: Filters) {
    try {
      const queryParams = params.reduce((acum, current) => acum + ' ' + current, '').trim()
      const health = filters?.health?.reduce((acum, current) => acum + '&health=' + current, '').trim() ?? ''
      const timeToCook = filters?.timeToCook ? `&time=0-${filters.timeToCook}` : ''
      const random = '&random=true'
      const res = await axios.get(ApiUrlGetter(queryParams + health + timeToCook + random))
      const recipesPromise = res.data.hits.map(async (hit: any) => {
        const recipeId = hit._links.self.href.split('v2/')[1].split('?')[0]
        const recipe = await createRecipe(hit.recipe)
        return { ...recipe, id: recipeId }
      })

      const recipes = await Promise.all(recipesPromise)

      //TODO: Change from partial to full
      this.postPartialRecipes(recipes)

      return recipes
    } catch (e) {
      console.log(e)
    }
  }

  async getRandomRecipe() {
    let results = []
    let index = Math.floor(Math.random() * 100)
    let res = await axios.get(ApiUrlGetter(ingredients[index]))
    if (res?.data?.hits?.length == 0) {
      res = await axios.get(ApiUrlGetter('carne'))
    }
    let recipeLength = res?.data?.hits?.length
    if (res?.data?.hits?.length > 5) {
      recipeLength = 5
    }
    for (let i = 0; i < recipeLength; i++) {
      let recipe = res.data.hits[i]?.recipe
      let resultIteration = await createRecipe(recipe)
      const recipeId = res.data.hits[i]._links.self.href.split('v2/')[1].split('?')[0]
      results.push({ ...resultIteration, id: recipeId })
    }
    return results
  }

  async getRandomRecipeByCategory(category:string){
    const recipe = await axios.get(ApiUrlGetter(category))
    let random = []
    const dessert = []
    for(let i = 0; i< 10 ; i++){
      random.push(Math.floor(Math.random()*recipe?.data?.hits?.length))
    }
    random = eliminaDuplicados(random)
    for(let index of random){
      dessert.push(await createRecipe(recipe?.data?.hits[index].recipe))
    }
    return dessert
  }
  async postPartialRecipes<T>(recipes: T & { id: string }[]) {
    const { data, error } = await supabase
      .from('recipe')
      .upsert(recipes.map((r) => ({ id: r.id })))
      .select('id')
  }

  async postRecipe(recipe: any) {
    const tagsIdsPromise = postTags(recipe.tags)
    const ingredientsIdsPromise = postIngredients(recipe.ingredients)
    const [tagsIds, ingredientsIds] = await Promise.all([tagsIdsPromise, ingredientsIdsPromise])
    const { data, error } = await supabase
      .from('recipe')
      .insert([
        {
          id: recipe.id,
          name: recipe.name,
          calories: recipe.calories,
          image_url: recipe.image,
          recipe_url: recipe.link,
          time_to_cook: recipe.timeToCook,
          serves: recipe.serves,
        },
      ])
      .select('id')
    if (error) {
      console.log(error)
    }
    if (data) {
      const recipeTagsPromise = supabase.from('recipe_tag').insert(
        tagsIds.map((tagId) => ({
          recipe_id: data[0].id,
          tag_id: tagId,
        }))
      )

      const recipeIngredientsPromise = supabase.from('recipe_ingredient').insert(
        ingredientsIds.map((ingredientId) => ({
          recipe_id: data[0].id,
          ingredient_id: ingredientId,
        }))
      )

      const [recipeTags, recipeIngredients] = await Promise.all([recipeTagsPromise, recipeIngredientsPromise])
      if (recipeTags.error || recipeIngredients.error) {
        console.log(recipeTags.error, recipeIngredients.error)
      }
    }
  }

  async saveRecipe(recipeId: string, userId: string) {
    const res = await supabase.from('user_saved_recipe').insert([
      {
        user_id: userId,
        recipe_id: recipeId,
      },
    ])
    if (res.error) {
      throw new Error(res.error.message)
    }
    return recipeId
  }

  async getSavedRecipes(userId: string): Promise<any[]> {
    const res = await supabase
      .from('user_saved_recipe')
      .select(
        `
        user_id, 
        recipe(*)
      `
      )
      .eq('user_id', userId)

    if (res.error) {
      throw new Error(res.error.message)
    }
    const recipeIds = res.data.map((userRecipe) => userRecipe.recipe.id)
    const recipesPromise = recipeIds.map(async (recipeId) => {
      const recipeDetails = await this.getRecipeById(recipeId)
      return recipeDetails
    })
    const recipes = await Promise.all(recipesPromise)

    return recipes
  }

  async getRecipeById(recipeId: string) {
    const res = await axios.get(ApiUrlGetterId(recipeId))
    return createRecipe(res.data.recipe)
  }
}

export default new EdamamService()
