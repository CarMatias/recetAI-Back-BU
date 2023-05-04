import IngredientsES from './ingredients_es.json'

type IngredientsKey = keyof typeof IngredientsES['data']

class LocalTranslate {
  translate(text: string, target: 'es' | 'en'): string {
    const result = IngredientsES.data[text.replaceAll(' ', '_') as IngredientsKey]
    if (result) {
      return result
    }
    return text
  }
}

export default new LocalTranslate()
