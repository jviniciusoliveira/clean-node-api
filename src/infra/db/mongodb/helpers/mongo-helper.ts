import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
    this.client = null
  },

  getCollection (name: string): Collection {
    return this.client.db('clean-node-api').collection(name)
  },

  map (data: any): any {
    const { _id, ...collectionWithoutId } = data
    return {
      id: _id,
      ...collectionWithoutId
    }
  },

  mapCollection (collection: any[]): any[] {
    return collection.map(c => MongoHelper.map(c))
  }
}
