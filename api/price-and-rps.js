import { MongoClient } from "mongodb"

export async function GET(request) {
    console.log(request.url)
    const uri = process.env.MONGODB_URI

    const client = new MongoClient(uri)

    await client.connect()

    const dbName = 'chaoding_stocks'
    const collectionName = 'all'

    const database = client.db(dbName)
    const collection = database.collection(collectionName)

    const result = await collection.aggregate([
        {
            $lookup:
            {
                from: 'g_stock',
                localField: 'company_code',
                foreignField: 'company_code',
                as: 'g_stock'
            }
        },
        {
            $unwind: {
                path: '$g_stock',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                company_code: 1,
                company_abbr: 1,
                rps_5: 1,
                rps_10: 1,
                rps_20: 1,
                rps_60: 1,
                rps_120: 1,
                rps_250: 1,
                rps_mean: 1,
                bk: 1,
                m10: 1,
                m10_offset_pct: 1,
                close: 1,
                change_pct: 1,
                change_abs: 1,
                rvol: 1,
                company_pinyin: 1,
                g_stock: { $ifNull: ['$g_stock.g_stock', '-'] }
            }
        }
    ]).toArray()

    client.close()

    return new Response(JSON.stringify(result))
}