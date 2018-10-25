module.exports = {
	apps: [{
		name: "Blog",
		// 最大内存限制
		max_memory_restart: "500M",
		script: "./bin/www",
		// 最大限度地使用CPUs
		instances: "max",
		exec_mode: "cluster",
		out_file: "~/.pm2/logs/blog_out.log",
		error_file: "~/.pm2/logs/blog_error.log",
		merge_logs: true,
		log_date_format: "YYYY-MM-DD HH:mm:ss",
		env: {
			"PORT": 3000,
			"NODE_ENV": "development",
		},
		env_production: {
			"PORT": 3001,
			"NODE_ENV": "production"
		}
	}],

	// deploy : {
	//   production : {
	//     user : 'node',
	//     host : '212.83.163.1',
	//     ref  : 'origin/master',
	//     repo : 'git@github.com:repo.git',
	//     path : '/var/www/production',
	//     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
	//   }
	// }
};
