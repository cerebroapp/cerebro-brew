import { Fzf } from "fzf";
import memoize from "memoizee"

const ONE_DAY = 24 * 60 * 60 * 1000

const getBrewPackagesFzf = async () => {
  console.log('Fetching brew packages...')
  const casksRequest = await fetch('https://formulae.brew.sh/api/versions-casks.json')
  const caskPackages = casksRequest.ok ? Object.keys(await casksRequest.json()) : []

  const formulaeRequest = await fetch('https://formulae.brew.sh/api/versions-formulae.json')
  const formulaePackages = formulaeRequest.ok ? Object.keys(await formulaeRequest.json()) : []

  return new Fzf([...new Set([...caskPackages, ...formulaePackages])])
}

const cachedBrewPackagesFzf = memoize(getBrewPackagesFzf, {
  length: false,
  promise: 'then',
  maxAge: ONE_DAY,
  preFetch: true
})

/**
 * Get package suggestions for entered query
 * @param {string} query
 * @param {boolean} forceRefresh
 * @return {Promise}
 */
export const getSuggestions = async (query, forceRefresh = false): Promise<string[]> => {
  if (forceRefresh) {
    cachedBrewPackagesFzf.clear()
  }

  return new Promise((resolve, reject) => {
    cachedBrewPackagesFzf()
      .then(fzf => {
        return resolve(fzf.find(query).map(({item}) => item))
      }).catch(error => {
        return reject(error)
      })
  })
}
