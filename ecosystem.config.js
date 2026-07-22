module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: '/var/www/frontend',
      script: 'npm',
      args: 'start -- --port 3000',
      interpreter: 'none'
    }
  ]
}