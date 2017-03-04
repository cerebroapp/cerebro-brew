import { memoize } from 'cerebro-tools'

/**
 * Get package suggestions for entered query
 * @param  {String} query
 * @return {Promise}
 */
const getSuggestions = (query) => {
  const url = `http://searchbrew.com/search?q=${query}`
  return fetch(url)
    .then(response => response.json())
    .then(items => items['data'].map(i => i.title))
}


export default memoize(getSuggestions, {
  length: false,
  promise: 'then',
  // Expire translation cache in 30 minutes
  maxAge: 30 * 60 * 1000,
  preFetch: true
})
