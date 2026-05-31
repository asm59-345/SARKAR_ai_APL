import redis

r = redis.from_url(
    "rediss://default:gQAAAAAAAiQjAAIgcDE3NDY0MjQwNGQ3NDc0YTkwOTczZDI3M2RkMDMzZjYwMA@valid-sculpin-140323.upstash.io:6379",
    decode_responses=True
)

print("Upstash Cloud Redis Connection Ping Result:", r.ping())
