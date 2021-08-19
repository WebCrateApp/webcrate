
export const isDev = process.env.DETA_RUNTIME !== 'True' && process.env.DETA_RUNTIME !== 'true'
export const isSpace = process.env.DETA_SPACE_APP === 'True' || process.env.DETA_SPACE_APP === 'true'
export const subdomain = process.env.DETA_PATH
export const domain = isDev ? 'localhost:3000' : `${ subdomain }.${ isSpace ? 'deta.app' : 'deta.dev' }`