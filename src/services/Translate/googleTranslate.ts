import { Translate } from '@google-cloud/translate/build/src/v2'

class GoogleTranslateService {
  async translate(text: string, target: 'es' | 'en'): Promise<string> {
    const translate = new Translate({ key: 'AIzaSyD4TnYJ2h-1pi50UetORAjBICV8lYI3_14' })
    const [translation] = await translate.translate(text, { from: target === 'en' ? 'es' : 'en', to: target })
    return translation
  }
}

export default new GoogleTranslateService()
