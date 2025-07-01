module.exports = {
  apps: [
    {
      name: 'uninest',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Monitoring
      monitoring: true,
      pmx: true,
      
      // Auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      
      // Advanced features
      min_uptime: '10s',
      max_restarts: 10,
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/uninest.git',
      path: '/var/www/uninest',
      'post-deploy': 'npm install && npm run build:standalone && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
};