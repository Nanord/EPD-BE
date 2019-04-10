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
    autorestart: false,
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
      SMORODINA_MOD_EPD_PORT: string = "7676",
      SMORODINA_MOD_EPD_FAKEID: string = "true",

      //BE sod config
      SMORODINA_MOD_EPD_SOD_ENDPOINT: string = "http://172.16.200.193:8077/SOD",

      //BE Access config
      SMORODINA_ACCESS_SERVER_HOST: string = "172.16.200.193",
      SMORODINA_ACCESS_SERVER_PORT: string = "8050",
    },
    env_production: {
      NODE_ENV: 'production'
    },

    //Logs
    // merge_logs: true,
    // log_date_format: "YYYY-MM-DD HH:mm Z",
    // error_file: "./logs/error.log",
    // out_file: "./logs/work.log"
  }],

 /* deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }*/

};
