export const isDev = process.env.DETA_RUNTIME !== 'True' && process.env.DETA_RUNTIME !== 'true' && process.env.DETA_SPACE_APP !== 'true'
export const isSpace = process.env.DETA_SPACE_APP === 'True' || process.env.DETA_SPACE_APP === 'true'
// eslint-disable-next-line no-nested-ternary
export const domain = isDev ? 'localhost:3000' : isSpace ? process.env.DETA_SPACE_APP_HOSTNAME : `${ process.env.DETA_SPACE_APP_HOSTNAME }.deta.dev`
export const version = process.env.DETA_SPACE_APP_VERSION
export const latestReleaseUrl = process.env.LATEST_RELEASE_URL || 'https://deta.space/api/v0/discovery/apps/@maxs1/webcrate'