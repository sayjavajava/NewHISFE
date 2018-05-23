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
    AppConstants.USER_BY_ROLE = '/user/role/';
    AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI = '/setting/department/';
    AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI = '/setting/department/delete/';
    AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL = '/setting/department/search/';
    AppConstants.SAVE_CLINICAL_DEPARTMENT_URL = '/setting/department/save';
    AppConstants.UPDATE_CLINICAL_DEPARTMENT_URL = '/setting/department/update';
    AppConstants.CREATE_USER_ENDPOINT = '/user/add';
    AppConstants.USER_SEARCH = '/user/search/';
    AppConstants.FETCH_ALL_USERS_URI = '/user/';
    ////////////////////// Branch URLs ///////////////////////////////
    AppConstants.ADD_BRANCH = '/branch/create';
    AppConstants.UPDATE_BRANCH = '/setting/update/';
    AppConstants.BRANCHES_NAME = '/branch/name';
    AppConstants.BRANCH_SEARCH = '/branch/search/';
    AppConstants.FETCH_ALL_BRANCHES_URL = '/setting/branch/';
    ////////////////////// ICD URLs ///////////////////////////////
    AppConstants.ICD_CODE = '/setting/icd/code';
    AppConstants.ICD_CODE_SAVE_URL = '/setting/icd/code/save';
    AppConstants.ICD_CODE_UPDATE_URL = '/setting/icd/code/update';
    AppConstants.ICD_CODES = '/setting/icd/codes/';
    AppConstants.ICD_CODE_DELETE_URL = '/setting/icd/code/delete?codeId=';
    AppConstants.ICD_CODE_SEARCH = '/setting/icd/code/search/';
    AppConstants.ICD_VERSION_SAVE_URL = '/setting/icd/version/save';
    AppConstants.ICD_VERSION_UPDATE_URL = '/setting/icd/version/update';
    AppConstants.ICD_VERSIONS = '/setting/icd/versions/';
    AppConstants.ICD_VERSION_DELETE_URL = '/setting/icd/version/delete?iCDVersionId=';
    AppConstants.ICD_VERSION_SEARCH = '/setting/icd/version/search/';
    AppConstants.ICD_CODE_VERSION_SAVE_URL = '/setting/icd/codeVersion/save';
    AppConstants.ICD_CODE_VERSIONS = '/setting/icd/codeVersions/';
    AppConstants.ICD_CODE_VERSION_DELETE_URL = '/setting/icd/codeVersion/delete?associateICDCVId=';
    AppConstants.ICD_CODE_VERSION_SEARCH = '/setting/icd/codeVersion/search/';
    AppConstants.ICD_VERSION_CODES_VERSION = '/setting/icd/version/codes/?versionId=';
    AppConstants.ROLE_ENDPOINT = '/setting/rolePermission/add';
    AppConstants.PERMISSION_ENDPOINT = '/user/auth/authorities';
    AppConstants.PERMISSION_BY_ROLE = '/setting/rolePermission/role';
    AppConstants.ASSIGN_PERMISSIONS_TO_ROLES = '/setting/rolePermission/assignAuthorities';
    ////////////////////// Service Tax URLs ///////////////////////////////
    AppConstants.FETCH_ALL_TAX_URL = '/setting/tax/';
    AppConstants.SERVICE_TAX_SAVE_URL = '/setting/tax/save';
    AppConstants.SERVICE_TAX_DELETE_URL = '/setting/tax/delete?taxId=';
    AppConstants.SERVICE_TAX_UPDATE_URL = '/setting/tax/update';
    AppConstants.SERVICE_TAX_SEARCH_URL = '/setting/tax/search/';
    ////////////////////// Service Tax URLs ///////////////////////////////
    AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL = '/setting/medicalService/';
    AppConstants.SAVE_MEDICAL_SERVICES_URL = '/setting/medicalService/save';
    AppConstants.UPDATE_MEDICAL_SERVICES_URL = '/setting/medicalService/update';
    AppConstants.DELETE_MEDICAL_SERVICES_URL = '/setting/medicalService/delete?';
    AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL = '/setting/medicalService/id/';
    AppConstants.MEDICAL_SERVICE_SEARCH = '/setting/medicalService/search/';
    return AppConstants;
}());
exports.AppConstants = AppConstants;
//# sourceMappingURL=app.constants.js.map