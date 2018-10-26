module.exports = {
	apps: [{
		name: "Blog",
		// 最大内存限制
		max_memory_restart: "500M",
		script: "./bin/www",
		// 最大限度地使用CPUs
		instances: "max",
		exec_mode: "cluster",
		// 最小运行时间，如果程序在这个时间内退出，会被认为错误，自动重启
		min_uptime: "120s", 
		// 定时重启 （*/30 * * * *）每隔30分钟重启一次，（0 10 9 * * *） 每天9:10重启一次 
		cron_restart: "0 1 1 * * *", 
		env: {
			"PORT": 3000,
			"NODE_ENV": "development",
		},
		env_production: {
			"PORT": 3001,
			"NODE_ENV": "production"
		},
		out_file: "~./logs/blog_out.log",
		error_file: "./logs/blog_error.log",
		merge_logs: true,
		log_date_format: "YYYY-MM-DD HH:mm:ss",
		// 启用/禁用 项目崩溃或退出时自动重启
		autorestart: false, 
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
