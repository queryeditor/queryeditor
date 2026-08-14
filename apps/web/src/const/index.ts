import Mariadb from '@queryeditor/shared/icons/maria-db.svg'
import Mysql from '@queryeditor/shared/icons/mysql.svg'
import Sqlserver from '@queryeditor/shared/icons/sql-server.svg'
import Postgresql from '@queryeditor/shared/icons/postgresql.svg'
import Cloudflare from '@queryeditor/shared/icons/cloudflare.svg'
import Sqlite from '@queryeditor/shared/icons/sqlite.svg'

export const DATABASES = {
  mysql: {
    name: 'MySQL',
    description:
      'MySQL is an open-source relational database management system.',
    available: true,
    icon: Mysql
  },
  sqlite: {
    name: 'SQLite',
    available: true,
    icon: Sqlite
  },
  d1: {
    name: 'Cloudflare D1',
    available: true,
    icon: Cloudflare
  },
  postgres: {
    name: 'PostgreSQL',
    available: false,
    icon: Postgresql
  },
  mariadb: {
    name: 'MariaDB',
    available: false,
    icon: Mariadb
  },
  sqlserver: {
    name: 'SQL Server',
    available: false,
    icon: Sqlserver
  }
} as const

export const WAITLIST_URL = 'https://form.typeform.com/to/jBtGN2Xa' as const

export const DAUSTINN = {
  github: 'https://github.com/daustinn',
  website: 'https://daustinn.com',
  x: 'https://x.com/daustinndev',
  buyMeACoffee: 'https://www.buymeacoffee.com/daustinn'
} as const
