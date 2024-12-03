// Convertir une instance de Date en format HH:mm
export function dateToTime(date) {
  if (!(date instanceof Date)) return null
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Convertir un format HH:mm en instance Date (aujourd'hui)
export function timeToDate(time) {
  if (!time) return null
  const [hours, minutes] = time.split(':').map(Number)

  const fixedDate = new Date('2000-01-01T00:00:00Z')
  fixedDate.setHours(hours, minutes, 0, 0)
  return fixedDate
}

export function floatToTime(hours) {
  const hour = Math.floor(hours)
  const minutes = Math.round((hours - hour) * 60)

  const formattedHour = hour.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')

  return `${formattedHour}:${formattedMinutes}`
}
