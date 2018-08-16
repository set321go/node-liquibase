const path = require('path');
const childProcess = require('child_process');

class Liquibase {
	constructor(params = {}) {
		const defaultParams = {
			liquibaseBinary: path.normalize('lib/liquibase-3.6.2-bin/liquibase')
		};
		this.params = Object.assign({}, defaultParams, params);
	}

	get command() {
		let cmd = `${this.params.liquibaseBinary}`;
		Object.keys(this.params).forEach(key => {
			if (key === 'liquibaseBinary') {
				return;
			}
			const value = this.params[key];
			cmd = `${cmd} --${key}=${value}`;
		});
		return cmd;
	}

	exec(command, options = {}) {
		let child;
		let promise = new Promise((resolve, reject) => {
			child = childProcess
				.exec(command, options, (error, stdout) => {
					if (error) {
						return reject(error);
					}
					resolve({stdout: stdout});
				});
		});
		child.stdout.pipe(process.stdout);
		promise.child = child;
		return promise;
	}

	run(action = 'update', params = '') {
		return this.exec(`${this.command} ${action} ${params}`);
	}
}

module.exports = params => new Liquibase(params);
