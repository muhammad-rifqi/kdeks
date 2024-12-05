const util = require('util');

const pgsql = require('pg');
const pool = new pgsql.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'kneks',
    password: '123',
    port: 5432,
})

pool.query = util.promisify(pool.query);

const executeQuery = (query, arraParms) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query(query, arraParms, (err, data) => {
                if (err) {
                    console.log("error in executing the query");
                    reject(err);
                }
                resolve(data?.rows);
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { executeQuery };
