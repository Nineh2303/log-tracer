import { redis } from './_lib/redis'

export default async function handler(req: any, res: any) {
    const id = crypto.randomUUID()

    await redis.set(id, req.body, {
        ex: 50
    })

    return res.json({ id })
}