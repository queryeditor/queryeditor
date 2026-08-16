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
    name: 'D1',
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
