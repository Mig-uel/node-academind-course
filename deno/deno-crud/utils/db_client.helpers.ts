import '@std/dotenv/load'
import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.32.0/mod.ts'

const URI = Deno.env.get('MONGO_URI') as string

let db: Database

export const connect = async () => {
  const client = new MongoClient()
  await client.connect(URI)

  db = client.database('todos')
}

export const getDB = (): Database => {
  if (!db) throw new Error('DB not initialized!')

  return db
}
