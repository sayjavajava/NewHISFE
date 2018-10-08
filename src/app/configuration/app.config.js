"use strict";
/* Deployment Profiles */
Object.defineProperty(exports, "__esModule", { value: true });
/* Local Or Default */
var AppConfig = (function () {
    function AppConfig() {
    }
    /*********************************************************************/
    /*                             Local                                 */
    /*********************************************************************/
    AppConfig.BE_HTTP_PROTOCOL = 'http';
    AppConfig.BE_HTTP_SEPARATOR = '://';
    AppConfig.BE_API_ENDPOINT = '127.0.0.1';
    //public static BE_API_ENDPOINT = '192.168.1.210';
    AppConfig.BE_API_PORT = '8080';
    AppConfig.BE_API_CONTEXT_PATH = 'HIS';
    AppConfig.BE_ACCESS_CLIENT = 'HISClient';
    AppConfig.BE_ACCESS_SECRET = 'HISSecret';
    return AppConfig;
}());
exports.AppConfig = AppConfig;
//# sourceMappingURL=app.config.js.map