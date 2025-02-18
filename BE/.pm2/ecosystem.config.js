module.exports = {
  apps : [{
    name: 'API',
    //Main Script
    script: './dist/index.js',
    //Args for run
    args: '',
    //count cluster
    instances: 2,
    //interpreter
    interpreter: "node",
    interpreter_args: "",
    //process settings
    autorestart: true,
    watch: true,
    exec_mode: "fork",
    max_memory_restart: '1G',
    kill_timeout : 3000,
    listen_timeout : 1000,

    env: {
      NODE_ENV: 'development',
      //BE general config
      SMORODINA_ALLOW_ORIGIN: string = "*",

      //BE config
      SMORODINA_MOD_EPD_PORT: string = "",
      SMORODINA_MOD_EPD_FAKEID: string = "true",

      //BE sod config
      SMORODINA_MOD_EPD_SOD_ENDPOINT: string = "",

      //BE Access config
      SMORODINA_ACCESS_SERVER_HOST: string = "",
      SMORODINA_ACCESS_SERVER_PORT: string = "",
    },
    env_production: {
      NODE_ENV: 'production'
    },

    //Logs
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: ".pm2/logs/error.log",
    out_file: ".pm2/logs/work.log"
  }],

 /* deploy : {
    production : {
      user : 'node',
      host : '',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }*/

};
