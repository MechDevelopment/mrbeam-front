import en from '../lang/en.json'
import ru from '../lang/ru.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = (query.locale as string) || 'en'

  return { en, ru }[locale]
})
