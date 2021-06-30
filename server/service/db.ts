import { Deta } from 'deta'

import isDev from '../utils/isDev'

const deta = Deta(isDev ? process.env.DETA_PROJECT_KEY || '' : '')

export default deta