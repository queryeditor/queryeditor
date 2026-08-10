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

export const CAROUSEL_ITEMS = {
  'multiple-connections': {
    title: ['Multiple', 'connections'],
    background: '/hero-bg-2.webp',
    description:
      'Create multiple connections, group them, and connect to them simultaneously.',
    image: '/start.webp',
    imageWidth: 500
  },
  'completion-and-syntax': {
    title: ['Completion', 'and syntax'],
    background: '/hero-bg-3.webp',
    description:
      'Write queries faster with smart completion and syntax highlighting.',
    image: '/completion.webp',
    imageWidth: 650
  },
  'tabs-per-connection': {
    title: ['Tabs', 'per connection'],
    background: '/hero-bg.webp',
    description: 'Multiple tabs per connection to work faster on your queries.',
    image: '/tabs.webp',
    imageWidth: 650
  },
  'data-grid': {
    title: ['Data', 'Grid'],
    background: '/hero-bg-4.webp',
    description:
      'View your results in a powerful data grid with support for sorting, filtering, and more.',
    image: '/data-grid.webp',
    imageWidth: 650
  }
} as const

export const GOOD_THINGS = {
  'Powered by Monaco editor': {
    description:
      'The QueryEditor is built on top of the [https://github.com/microsoft/monaco-editor](Monaco editor), the same editor used in [https://code.visualstudio.com/](Visual Studio Code), and this makes the editor fast, with full autocomplete features and more.'
  },
  'Support for multiple databases': {
    description:
      'The QueryEditor allows multiple database connections, including [https://www.mysql.com/](MySQL), [https://www.sqlite.org/](SQLite), [https://www.cloudflare.com/products/d1/](Cloudflare D1), and many more to come. You can connect to multiple databases simultaneously.'
  },
  'Modern and elegant design': {
    description:
      'The QueryEditor features a modern and elegant design, with a dark theme that is easy on the eyes and a light theme for those who prefer it.'
  },
  'Efficient data grid for large datasets': {
    description:
      'The QueryEditor includes a powerful data grid that can handle large datasets efficiently, with support for sorting, filtering, and more.'
  },
  'SSH, SSL support': {
    description:
      'The QueryEditor supports SSH and SSL connections, allowing you to connect securely to your databases.'
  },
  'Easy-to-use': {
    description:
      'The QueryEditor is designed to be easy to use, with a simple and intuitive interface that allows you to focus on your queries.'
  }
}

export const BUY_ME_A_COFFEE_URL =
  'https://www.buymeacoffee.com/daustinn' as const
