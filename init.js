'use strict';

const { session: db } = require('./db-connection');

const constraints = async verb => {
    console.log(`Running ${verb} constraints...`);

    const constraintQueries = [
        `${verb} CONSTRAINT ON (s:Supplier) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Supplier) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (c:Contract) ASSERT c.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (c:Contract) ASSERT exists(c.id)`,
        `${verb} CONSTRAINT ON (r:Submission) ASSERT r.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (r:Submission) ASSERT exists(r.id)`,
        `${verb} CONSTRAINT ON (s:Survey) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Survey) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (s:Survey) ASSERT exists(s.version)`,
        // cmdb constainsts
        `${verb} CONSTRAINT ON (s:Domain) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Domain) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (c:Endpoint) ASSERT c.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (c:Endpoint) ASSERT exists(c.id)`,
        `${verb} CONSTRAINT ON (r:Group) ASSERT r.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (r:Group) ASSERT exists(r.id)`,
        `${verb} CONSTRAINT ON (s:Person) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Person) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (s:Product) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Product) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (s:Repository) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Repository) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (s:System) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:System) ASSERT exists(s.id)`,
        `${verb} CONSTRAINT ON (s:Team) ASSERT s.id IS UNIQUE`,
        `${verb} CONSTRAINT ON (s:Team) ASSERT exists(s.id)`,
    ];

    const setupConstraintIfPossible = constraintQuery =>
        db.run(constraintQuery).catch(error => {
            console.error('Error creating constraint', error);
            return undefined;
        });
    const constraints = await Promise.all(constraintQueries.map(setupConstraintIfPossible)).then(() =>
        db.run('CALL db.constraints')
    );

    console.log('CALL db.constraints ok?', verb, constraints.records.length);
};

const init = async () => {
    console.log('Running DB init');

    // DROP
    await constraints('DROP');

    // CREATE
    await constraints('CREATE');
};

if (process.argv[1] === __filename) {
    init()
        .then(result => {
            console.log('Completed init');
            process.exit(0);
        })
        .catch(error => {
            console.error('Init failed, ', error);
            process.exit(1);
        });
}
