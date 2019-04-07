module.exports = {
  apps : [{
    name: 'API',
    //Main Script
    script: 'dist/index.js',
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
    exec_mode: "cluster",
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

      //BE  public sma config
      SMA_HOST: string = "172.16.200.193",
      SMA_PORT: string = "4466",

      //BE sod config
      SMORODINA_MOD_EPD_SOD_ENDPOINT: string = "http://172.16.200.193:8077/SOD",

      //BE Access config
      SMORODINA_ACCESS_SERVER_HOST: string = "172.16.200.193",
      SMORODINA_ACCESS_SERVER_PORT: string = "8050",

      //FE general config
      SMORODINA_BUILD_TYPE: string = "testflight",
      SMORODINA_BUILD_ANALYZ: string = "false",
      SMORODINA_BUILD_SOURCE_MAP: string = "true",

      //FE mod config
      SMORODINA_BUILD_MOD_EPD_HOST: string = "172.16.200.193:7676",
      SMORODINA_BUILD_MOD_EPD_HTTPS: string = "false",
      SMORODINA_BUILD_MOD_EPD_APIV: string = "1",
      SMORODINA_REACT_EXTERNAL: string = "false",

      //BE prisma
      SMORODINA_MOD_EPD_PRISMA_HOST: string = "127.0.0.1",
      SMORODINA_MOD_EPD_PRISMA_PORT: string = "4466"
    },
    env_production: {
      NODE_ENV: 'production'
    },

    //Logs
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: "./logs/error.log",
    out_file: "./logs/work.log"
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
