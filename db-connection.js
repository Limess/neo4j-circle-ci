'use strict';

const neo4j = require('neo4j-driver').v1;

const { BOLT_URL: url, BOLT_USER: username, BOLT_PASSWORD: password } = process.env;

const driver = neo4j.driver(url, neo4j.auth.basic(username, password));

console.log('Connected to neo4j database', {
    url,
    username,
    passwordSet: !!password,
});

module.exports = {
    driver,
    session: driver.session(),
};
