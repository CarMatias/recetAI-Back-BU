class MockTranslate {
  translate(text: string, target: 'es' | 'en'): Promise<string> {
    return new Promise((resolve) => {
      resolve(text)
    })
  }
}

export default new MockTranslate()
