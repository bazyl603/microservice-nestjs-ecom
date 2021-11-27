var dbConfig = {
  synchronize: true,
    migrations: ['migrations/*.js'],
    cli: {
      migrationsDir: 'migrations',
    },
  };
  
  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ['**/*.entity.js'],
      });
      break;
    case 'test':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts']
      });
      break;
    case 'production':
      Object.assign(dbConfig, {
        "type": "mysql",
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "username": "root",
        "password": process.env.DB_PASSWORD,
        "database": "auth",
        "entities": ['**/*.entity.js'],
        "synchronize": true
      });
      break;
    default:
      throw new Error('unknown environment');
  }
  
  module.exports = dbConfig;