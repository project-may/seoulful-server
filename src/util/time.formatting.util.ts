export const msToCronExpression = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const cronExpression = `${seconds % 60} ${minutes % 60} ${hours % 24} * * ${days}`
  return cronExpression
}
