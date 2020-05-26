import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  // como é typescript, a sintaxe do objeto (criado aqui)
  // conflita com a forma de setar o tipo de uma variavel em TS
  // então seta null e dai atribui
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }

}
