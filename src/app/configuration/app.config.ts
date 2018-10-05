/* Deployment Profiles */

/* Local Or Default */

export class AppConfig {

    /*********************************************************************/
    /*                             Local                                 */
    /*********************************************************************/

    public static BE_HTTP_PROTOCOL = 'http';
    public static BE_HTTP_SEPARATOR = '://';
<<<<<<< HEAD
    public static BE_API_ENDPOINT = '127.0.0.1';
    //public static BE_API_ENDPOINT = '192.168.1.210';

=======
//  public static BE_API_ENDPOINT = '127.0.0.1';
//  public static BE_API_ENDPOINT = '192.168.1.150';
    public static BE_API_ENDPOINT = '192.168.1.113';
>>>>>>> 94b16bf30baca43d3c28bfcd49a616a8808bb523
    public static BE_API_PORT = '8080';
    public static BE_API_CONTEXT_PATH = 'HIS';
    public static BE_ACCESS_CLIENT = 'HISClient';
    public static BE_ACCESS_SECRET = 'HISSecret';

    /*********************************************************************/
    /*                             Dev                                   */
    /*********************************************************************/

    // public static BE_HTTP_PROTOCOL = 'http';
    // public static BE_HTTP_SEPARATOR = '://';
    // public static BE_API_ENDPOINT = '192.168.1.87';
    // public static BE_API_PORT = '8080';
    // public static BE_API_CONTEXT_PATH = 'his';
    // public static BE_ACCESS_CLIENT = 'HISClient';
    // public static BE_ACCESS_SECRET = 'HISSecret';

    /*********************************************************************/
    /*                             QA                                   */
    /*********************************************************************/


    /*********************************************************************/
    /*                             Staging                               */
    /*********************************************************************/


    /*********************************************************************/
    /*                             Production                            */
    /*********************************************************************/


}

