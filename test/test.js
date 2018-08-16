import test from 'ava';
import liquibase from '../src/index';

test('update success', async t => {
	await liquibase({
		classpath: 'test/lib/postgresql-9.4-1201.jdbc4.jar',
		changeLogFile: 'test/resources/liquibase/db.changelog.xml',
		url: '"jdbc:postgresql://localhost:5432/postgres?currentSchema=test"',
		username: 'postgres',
		password: 'secretpassword'
	})
	.run('update')
	.then(data => t.not(data.stdout, ''))
	.catch(err => {
		console.log(err);
		t.fail();
	});
});

test('update fail', async t => {
	await liquibase({
		classpath: 'test/lib/postgresql-9.4-1201.jdbc4.jar',
		changeLogFile: 'test/resources/liquibase/db.changelog.xml',
		url: '"jdbc:postgresql://localhost:5432/postgres?currentSchema=test"',
		username: 'postgres!123',
		password: 'admin!123'
	})
	.run('update')
	.then(() => t.fail())
	.catch(() => t.pass());
});
