import {Redis} from "@upstash/redis";


// const upstashUrl =  import.meta.env.UPSTASH_REDIS_REST_URL  as string
// const upstashToken =  import.meta.env.UPSTASH_REDIS_REST_TOKEN  as string

export const redis = new Redis({
    url:"https://beloved-frog-131191.upstash.io",
    token: "gQAAAAAAAgB3AAIgcDE0NTFiZGE5MjAzYWE0MWQ1ODY1M2Q5MjFhMGM1ZjNkMw",
})


// UPSTASH_REDIS_REST_URL=https://beloved-frog-131191.upstash.io
// UPSTASH_REDIS_REST_TOKEN=gQAAAAAAAgB3AAIgcDE0NTFiZGE5MjAzYWE0MWQ1ODY1M2Q5MjFhMGM1ZjNkMw