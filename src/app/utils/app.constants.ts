/**
 * @Author Irfan Nasim
 * @since 07-Sep-17
 * @Description Application Constants
 */
export class AppConstants {

    public static ACCESS_TOKEN = 'access_token';
    public static EXPIRE_PASSWORD_TOKEN = 'expire_password_token';
    public static FETCH_ALL_CLINICAL_DEPARTMENTS_URI = '/setting/department/';
    public static DELETE_CLINICAL_DEPARTMENTS_URI = '/setting/department/delete/';
    public static SEARCH_CLINICAL_DEPARTMENT_URL ='/setting/department/search/';
    public static SAVE_CLINICAL_DEPARTMENT_URL ='/setting/department/save';
    public static UPDATE_CLINICAL_DEPARTMENT_URL ='/setting/department/update';
    public static FETCH_ALL_BRANCHES_URL ='/setting/branch/';

    ////////////////////// ICD URLs ///////////////////////////////
    public static ICD_CODE = '/setting/icd/code';
    public static ICD_CODES = '/setting/icd/codes/';
    public static ICD_CODE_DELETE = '/setting/icd/code?codeId=';
    public static ICD_CODE_SEARCH = '/setting/icd/code/search/';
    public static ICD_VERSION = '/setting/icd/version';
    public static ICD_VERSIONS = '/setting/icd/versions/';
    public static ICD_VERSION_DELETE = '/setting/icd/version?iCDVersionId=';
    public static ICD_VERSION_SEARCH = '/setting/icd/version/search/';
    public static ICD_CODE_VERSION = '/setting/icd/codeVersion';
    public static ICD_CODE_VERSIONS = '/setting/icd/codeVersions/';
    public static ICD_CODE_VERSION_DELETE = '/setting/icd/codeVersion?associateICDCVId=';
    public static ICD_CODE_VERSION_SEARCH = '/setting/icd/codeVersion/search/';
    public static ICD_VERSION_CODES_VERSION = '/setting/icd/version/codes/?versionId=';

    public static ROLE_ENDPOINT = '/setting/rolePermission/add';
    public static PERMISSION_ENDPOINT = '/user/auth/authorities';
    public static PERMISSION_BY_ROLE = '/setting/rolePermission/role';
    public static ASSIGN_PERMISSIONS_TO_ROLES = '/setting/rolePermission/assignAuthorities';

    ////////////////////// Service Tax URLs ///////////////////////////////
    public static FETCH_ALL_TAX_URL ='/setting/tax/';
    ////////////////////// Email Template URLs ///////////////////////////////
    public static EMAIL_TEMPLATE_FETCH_ALL_URL ='/setting/emailTemplate/';
    public static EMAIL_TEMPLATE_DELETE_URL = '/setting/emailTemplate/delete/?id=';
    public static EMAIL_TEMPLATE_SAVE_URL = '/setting/emailTemplate/save';
    public static EMAIL_TEMPLATE_EDIT_URL = '/setting/emailTemplate/get/';
    public static EMAIL_TEMPLATE_UPDATE_URL = '/setting/emailTemplate/update';
    public static EMAIL_TEMPLATE_SEARCH_URL = '/setting/emailTemplate/search/';



}