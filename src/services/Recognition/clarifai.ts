import { RecognizedIngredient } from '../../schema/Ingredient'
import { ClarifaiResponse } from './types'

/* eslint-disable @typescript-eslint/no-var-requires */
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc')

const stub = ClarifaiStub.grpc()

const USER_APP_ID = {
  user_id: 'vq5kk0i3mmy4',
  app_id: '340a8b3fb70c4615b3c3b7a618c82b9c',
}

const metadata = new grpc.Metadata()
metadata.set('authorization', 'Key ' + USER_APP_ID.app_id)

const Models = {
  General: 'food-item-recognition',
  V1: 'food-item-v1-recognition',
}

const MODEL_ID = Models.V1

class ClarifaiService {
  recognize(imgBase64: string) {
    return new Promise<RecognizedIngredient[]>((resolve, reject) => {
      try {
        stub.PostModelOutputs(
          {
            model_id: MODEL_ID,
            inputs: [{ data: { image: { base64: imgBase64 } } }],
          },
          metadata,
          (err: unknown, response: ClarifaiResponse) => {
            if (err) {
              console.log('Error: ' + err)
              return
            }

            if (response.status.code !== 10000) {
              console.log(
                'Received failed status: ' + response.status.description + '\n' + response.status.details
              )
              return
            }

            const recognizedIngredients: RecognizedIngredient[] = []

            for (const c of response.outputs[0].data.concepts) {
              recognizedIngredients.push({
                name: c.name,
                id: c.id,
                confidence: c.value,
              })
            }
            resolve(recognizedIngredients)
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }
}

export default new ClarifaiService()
