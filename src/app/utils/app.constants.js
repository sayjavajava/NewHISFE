"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @Author Irfan Nasim
 * @since 07-Sep-17
 * @Description Application Constants
 */
var AppConstants = (function () {
    function AppConstants() {
    }
    AppConstants.ACCESS_TOKEN = 'access_token';
    AppConstants.EXPIRE_PASSWORD_TOKEN = 'expire_password_token';
    AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI = '/setting/department/';
    AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI = '/setting/department/delete/';
    AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL = '/setting/department/search/';
    AppConstants.SAVE_CLINICAL_DEPARTMENT_URL = '/setting/department/save';
    AppConstants.UPDATE_CLINICAL_DEPARTMENT_URL = '/setting/department/update';
    AppConstants.FETCH_ALL_BRANCHES_URL = '/setting/branch/';
    ////////////////////// ICD URLs ///////////////////////////////
    AppConstants.ICD_CODE = '/setting/icd/code';
    AppConstants.ICD_CODES = '/setting/icd/codes/';
    AppConstants.ICD_CODE_DELETE = '/setting/icd/code?codeId=';
    AppConstants.ICD_CODE_SEARCH = '/setting/icd/code/search/';
    AppConstants.ICD_VERSION = '/setting/icd/version';
    AppConstants.ICD_VERSIONS = '/setting/icd/versions/';
    AppConstants.ICD_VERSION_DELETE = '/setting/icd/version?iCDVersionId=';
    AppConstants.ICD_VERSION_SEARCH = '/setting/icd/version/search/';
    AppConstants.ICD_CODE_VERSION = '/setting/icd/codeVersion';
    AppConstants.ICD_CODE_VERSIONS = '/setting/icd/codeVersions/';
    AppConstants.ICD_CODE_VERSION_DELETE = '/setting/icd/codeVersion?associateICDCVId=';
    AppConstants.ICD_CODE_VERSION_SEARCH = '/setting/icd/codeVersion/search/';
    AppConstants.ICD_VERSION_CODES_VERSION = '/setting/icd/version/codes/?versionId=';
    AppConstants.ROLE_ENDPOINT = '/setting/rolePermission/add';
    AppConstants.PERMISSION_ENDPOINT = '/user/auth/authorities';
    AppConstants.PERMISSION_BY_ROLE = '/setting/rolePermission/role';
    AppConstants.ASSIGN_PERMISSIONS_TO_ROLES = '/setting/rolePermission/assignAuthorities';
    ////////////////////// Service Tax URLs ///////////////////////////////
    AppConstants.FETCH_ALL_TAX_URL = '/setting/tax/';
    ////////////////////// Email Template URLs ///////////////////////////////
    AppConstants.EMAIL_TEMPLATE_FETCH_ALL_URL = '/setting/emailTemplate/';
    AppConstants.EMAIL_TEMPLATE_DELETE_URL = '/setting/emailTemplate/delete/?id=';
    AppConstants.EMAIL_TEMPLATE_SAVE_URL = '/setting/emailTemplate/save';
    AppConstants.EMAIL_TEMPLATE_EDIT_URL = '/setting/emailTemplate/get/';
    AppConstants.EMAIL_TEMPLATE_UPDATE_URL = '/setting/emailTemplate/update';
    AppConstants.EMAIL_TEMPLATE_SEARCH_URL = '/setting/emailTemplate/search/';
    return AppConstants;
}());
exports.AppConstants = AppConstants;
//# sourceMappingURL=app.constants.js.map