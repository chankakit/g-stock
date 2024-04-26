import { MongoClient } from "mongodb"

export async function GET(request) {
    const uri = process.env.MONGODB_URI

    const client = new MongoClient(uri)

    await client.connect()

    const dbName = 'chaoding_index'
    const collectionName = 'sse'

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const sse_index = await collection.find({}).limit(1).toArray()
    
    client.close()

    return new Response(JSON.stringify(sse_index[0]))
}