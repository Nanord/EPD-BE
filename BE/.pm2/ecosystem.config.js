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
    exec_mode: "cluster",
    max_memory_restart: '1G',
    kill_timeout : 3000,
    listen_timeout : 1000,

    env: {
        NODE_ENV: 'development',

        //BE general config",
        SMORODINA_ALLOW_ORIGIN: string = "*",
        DEBUG: string = "true",

        //BE config
        SMORODINA_EPD_PORT: string = "7676",
        SMORODINA_EPD_FAKEID: string = "true",

        //BE sod config
        SMORODINA_SOD_SERVER_HOST: string = "https://xn--e1aaobnafwhcg.xn--80ahmohdapg.xn--80asehdb/sod/SOD",

        //BE Access config
        SMORODINA_ACCESS_SERVER_HOST: string = "https://xn--e1aaobnafwhcg.xn--80ahmohdapg.xn--80asehdb/access/",
        SMORODINA_ACCESS_SERVER_PORT: string = "8050",

        //BE redis
        SMORODINA_EPD_REDIS_HOST: string = "redis",
        SMORODINA_EPD_REDIS_PORT: string = "6379",
        SMORODINA_EPD_REDIS_TTL: number = 3600
    },
    env_production: {
        NODE_ENV: 'production',

        SMORODINA_ALLOW_ORIGIN: string = "*",
        DEBUG: string = "false",

        //BE config
        SMORODINA_EPD_PORT: string = "7676",
        SMORODINA_EPD_FAKEID: string = "true",

        //BE sod config
        SMORODINA_SOD_SERVER_HOST: string = "https://xn--e1aaobnafwhcg.xn--80ahmohdapg.xn--80asehdb/sod/SOD",

        //BE Access config
        SMORODINA_ACCESS_SERVER_HOST: string = "https://xn--e1aaobnafwhcg.xn--80ahmohdapg.xn--80asehdb/access/",
        SMORODINA_ACCESS_SERVER_PORT: string = "8050",

        //BE redis
        SMORODINA_EPD_REDIS_HOST: string = "redis",
        SMORODINA_EPD_REDIS_PORT: string = "6379",
        SMORODINA_EPD_REDIS_TTL: string = "3600"
    },

    //Logs
    merge_logs: false,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: ".pm2/logs/error.log",
    out_file: ".pm2/logs/work.log"
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
