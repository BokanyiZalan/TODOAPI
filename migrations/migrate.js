const db = require('../config/db.js');

const migrations = [require('./001_create_tasks.js')];

migrations.forEach((migration) => {
   migration.run();
});


