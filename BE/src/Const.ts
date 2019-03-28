class Const{

	//BE general config
    static SMORODINA_ALLOW_ORIGIN: string = "*";

	//BE config
    static SMORODINA_MOD_EPD_PORT: string = "7676";
    static SMORODINA_MOD_EPD_FAKEID: string = "true";

	//BE static public sma config
    static SMA_HOST: string = "172.16.200.193";
    static SMA_PORT: string = "4466";

	//BE sod config
    static SMORODINA_MOD_EPD_SOD_ENDPOINT: string = "http://172.16.200.193:8077/SOD";

	//BE Access config
    static SMORODINA_ACCESS_SERVER_HOST: string = "172.16.200.193";
    static SMORODINA_ACCESS_SERVER_PORT: string = "8050";

	//FE general config
    static SMORODINA_BUILD_TYPE: string = "testflight";
    static SMORODINA_BUILD_ANALYZ: string = "false";
    static SMORODINA_BUILD_SOURCE_MAP: string = "true";

	//FE mod config
    static SMORODINA_BUILD_MOD_EPD_HOST: string = "172.16.200.193:7676";
    static SMORODINA_BUILD_MOD_EPD_HTTPS: string = "false";
    static SMORODINA_BUILD_MOD_EPD_APIV: string = "1";
    static SMORODINA_REACT_EXTERNAL: string = "false";

    //BE prisma
    static SMORODINA_MOD_EPD_PRISMA_HOST: string = "127.0.0.1";
    static SMORODINA_MOD_EPD_PRISMA_PORT: string = "4466";

}
export default Const;