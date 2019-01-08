"use strict";
/* Deployment Profiles */
/* Local Or Default */
Object.defineProperty(exports, "__esModule", { value: true });
var AppConfig = (function () {
    function AppConfig() {
    }
    /*********************************************************************/
    /*                             Local                                 */
    /*********************************************************************/
    AppConfig.BE_HTTP_PROTOCOL = 'http';
    AppConfig.BE_HTTP_SEPARATOR = '://';
    /*public static BE_API_ENDPOINT = '127.0.0.1';*/
    AppConfig.BE_API_ENDPOINT = '192.168.1.209';
    //'122.129.73.84';
    AppConfig.BE_API_PORT = '8080';
    AppConfig.BE_API_CONTEXT_PATH = 'HIS';
    AppConfig.BE_ACCESS_CLIENT = 'HISClient';
    AppConfig.BE_ACCESS_SECRET = 'HISSecret';
    return AppConfig;
}());
exports.AppConfig = AppConfig;
//# sourceMappingURL=app.config.js.map