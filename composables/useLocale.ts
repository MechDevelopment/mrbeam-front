import { parse } from 'accept-language-parser'
import { Api } from '@/config/api'

export default function () {
  const locale = useLocaleState()
  const dictionary = useDictionaryState()

  const getBrowserLocale = () => {
    const headers = useRequestHeaders(['accept-language'])
    const acceptLanguage = headers['accept-language']
    return acceptLanguage ? parse(acceptLanguage)[0].code : 'en'
  }

  const getDictionaryAsync = async (localeCode?: string) => {
    if (!localeCode) localeCode = getBrowserLocale()

    const options = { params: { locale: localeCode } }
    const { data } = await useFetch<Dictionary>(Api.GetDictionary, options)

    dictionary.value = data.value
    locale.value = localeCode
  }

  const translate = (key: string) => {
    return dictionary.value ? dictionary.value[key] : key
  }

  return {
    getDictionaryAsync,
    translate,
    locale,
  }
}
