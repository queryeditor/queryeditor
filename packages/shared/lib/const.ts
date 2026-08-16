import { DOCS_SITE, DOCS_BASE, HOME_BASE, HOME_SITE } from './env'

export const APP = {
  name: 'QueryEditor',
  urls: {
    waitlist: 'https://form.typeform.com/to/jBtGN2Xa',
    githubORG: 'https://github.com/queryeditor',
    githubRepo: 'https://github.com/queryeditor/queryeditor',
    x: 'https://x.com/queryeditor',
    docs: {
      site: DOCS_SITE,
      base: DOCS_BASE
    },
    home: {
      base: HOME_BASE,
      site: HOME_SITE
    }
  }
} as const

export const DAUSTINN = {
  name: 'Daustinn',
  urls: {
    github: 'https://github.com/daustinn',
    website: 'https://daustinn.com',
    x: 'https://x.com/daustinndev',
    buyMeACoffee: 'https://www.buymeacoffee.com/daustinn',
    slugtree: 'https://daustinn.com/slugtree'
  }
} as const
