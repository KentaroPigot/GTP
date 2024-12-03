import * as yup from 'yup'

export default yup.object().shape({
  startTime: yup
    .string()
    .required("L'heure de début est obligatoire.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format invalide. Utilisez HH:mm.')
    .test('min-time', "L'heure de début doit être au moins 08:00.", (value) => {
      const [hours, minutes] = value.split(':').map(Number)
      return hours > 8 || (hours === 8 && minutes >= 0)
    }),
  endTime: yup
    .string()
    .required("L'heure de fin est obligatoire.")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format invalide. Utilisez HH:mm.')
    .test('max-time', "L'heure de fin doit être au plus 18:00.", (value) => {
      const [hours, minutes] = value.split(':').map(Number)
      return hours < 18 || (hours === 18 && minutes === 0)
    })
    .test('start-before-end', "L'heure de fin doit être après l'heure de début.", function (value) {
      const { startTime } = this.parent
      if (!startTime || !value) return true
      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = value.split(':').map(Number)

      return endHours > startHours || (endHours === startHours && endMinutes > startMinutes)
    })
    .test(
      'max-duration',
      'La durée entre les deux heures ne peut pas dépasser 8 heures.',
      function (value) {
        const { startTime } = this.parent
        if (!startTime || !value) return true
        const [startHours, startMinutes] = startTime.split(':').map(Number)
        const [endHours, endMinutes] = value.split(':').map(Number)

        const startTotalMinutes = startHours * 60 + startMinutes
        const endTotalMinutes = endHours * 60 + endMinutes

        return endTotalMinutes - startTotalMinutes <= 8 * 60
      },
    ),
})
