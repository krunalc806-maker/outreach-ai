const requests = new Map<string, number[]>();

export function isRateLimited(key: string) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const recentRequests = (requests.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  recentRequests.push(now);
  requests.set(key, recentRequests);

  return recentRequests.length > 30;
}
