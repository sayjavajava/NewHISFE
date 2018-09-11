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
    AppConstants.USER_BY_ROLE = '/user/role';
    AppConstants.FETCH_ALL_CLINICAL_DEPARTMENTS_URI = '/setting/department/';
    AppConstants.DELETE_CLINICAL_DEPARTMENTS_URI = '/setting/department/delete/';
    AppConstants.SEARCH_CLINICAL_DEPARTMENT_URL = '/setting/department/search/';
    AppConstants.SAVE_CLINICAL_DEPARTMENT_URL = '/setting/department/save';
    AppConstants.UPDATE_CLINICAL_DEPARTMENT_URL = '/setting/department/update';
    AppConstants.CREATE_USER_ENDPOINT = '/user/add';
    AppConstants.USER_SEARCH = '/user/search/';
    AppConstants.FETCH_ALL_USERS_URI = '/user/';
    AppConstants.FETCH_USER_BY_ID = '/user/get/';
    ////////////////////// Branch URLs ///////////////////////////////
    AppConstants.ADD_BRANCH = '/setting/branch/create';
    AppConstants.UPDATE_BRANCH = '/setting/branch/update/';
    AppConstants.DELETE_BRANCH_URI = '/setting/branch/delete/';
    AppConstants.BRANCHES_NAME = '/setting/branch/name';
    AppConstants.BRANCH_SEARCH = '/setting/branch/search/';
    AppConstants.FETCH_ALL_BRANCHES_URL = '/setting/branch/';
    AppConstants.FETCH_ALL_BRANCHES_ALL_URL = '/setting/branch/all';
    AppConstants.FETCH_BRANCHES_BY_ID = '/setting/branch/get/';
    ////////////////////// Patients Invoices ///////////////////////////////
    AppConstants.SAVE_INVOICE = '/invoice/saveInvoice';
    AppConstants.GET_INVOICE_ITEMS = '/invoice/getInvoiceItemsById/';
    ////////////////////// Cashier Desk ///////////////////////////////
    AppConstants.GET_All_INVOICES = '/cashier/getAllInvoices';
    AppConstants.FETCH_APPOINTMENTS_BY_INOVICE_ID = '/cashier/getAppointmentByInvoiceId/';
    AppConstants.SAVE_PAYMENT = '/cashier/savePayment';
    ////////////////////// ICD URLs ///////////////////////////////
    AppConstants.ICD_CODE = '/setting/icd/code';
    AppConstants.ICD_CODE_SAVE_URL = '/setting/icd/code/save';
    AppConstants.ICD_CODE_UPDATE_URL = '/setting/icd/code/update';
    AppConstants.ICD_CODES = '/setting/icd/codes/';
    AppConstants.ICD_CODES_ASSOCIATED_BY_VERSION_ID = '/setting/icd/codes/associated/?versionId=';
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
    AppConstants.ROLE_ENDPOINT = '/user/auth/addRole';
    AppConstants.PERMISSION_ENDPOINT = '/user/auth/authorities';
    AppConstants.PERMISSION_BY_ROLE = '/user/auth/permission';
    AppConstants.ASSIGN_PERMISSIONS_TO_ROLES = '/user/auth/assignAuthorities';
    ////////////////////// Service Tax URLs ///////////////////////////////
    AppConstants.FETCH_ALL_TAX_URL = '/setting/tax/';
    AppConstants.SERVICE_TAX_SAVE_URL = '/setting/tax/save';
    AppConstants.SERVICE_TAX_DELETE_URL = '/setting/tax/delete?taxId=';
    AppConstants.SERVICE_TAX_UPDATE_URL = '/setting/tax/update';
    AppConstants.SERVICE_TAX_SEARCH_URL = '/setting/tax/search/';
    ////////////////////// Email Template URLs ///////////////////////////////
    AppConstants.EMAIL_TEMPLATE_FETCH_ALL_URL = '/setting/emailTemplate/';
    AppConstants.EMAIL_TEMPLATE_DELETE_URL = '/setting/emailTemplate/delete/?id=';
    AppConstants.EMAIL_TEMPLATE_SAVE_URL = '/setting/emailTemplate/save';
    AppConstants.EMAIL_TEMPLATE_EDIT_URL = '/setting/emailTemplate/get/';
    AppConstants.EMAIL_TEMPLATE_UPDATE_URL = '/setting/emailTemplate/update';
    AppConstants.EMAIL_TEMPLATE_SEARCH_URL = '/setting/emailTemplate/search/';
    ////////////////////// Medical Service URLs ///////////////////////////////
    AppConstants.FETCH_ALL_MEDICAL_SERVICES_URL = '/setting/medicalService/';
    AppConstants.SAVE_MEDICAL_SERVICES_URL = '/setting/medicalService/save';
    AppConstants.UPDATE_MEDICAL_SERVICES_URL = '/setting/medicalService/update';
    AppConstants.DELETE_MEDICAL_SERVICES_URL = '/setting/medicalService/delete?';
    AppConstants.FETCH_MEDICAL_SERVICES_BY_ID_URL = '/setting/medicalService/id/';
    AppConstants.MEDICAL_SERVICE_SEARCH = '/setting/medicalService/search/';
    AppConstants.FETCH_DEPARTMENTS_BY_MEDICAL_SERVICE_ID_URL = '/setting/medicalService/departments/';
    AppConstants.FETCH_BRANCHES_BY_MEDICAL_SERVICE_ID_URL = '/setting/medicalService/branches/';
    ////////////////////// Organization URLs ///////////////////////////////
    AppConstants.ORGANIZATION_CREATE_URL = '/setting/organization/create';
    AppConstants.TIMEZONE_FETCH_URL = '/setting/organization/timezone';
    AppConstants.FETCH_ALL_ORGANIZATION_URL_PAGINATED = '/setting/organization/';
    AppConstants.FETCH_ALL_ORGANIZATION_URL = '/setting/organization/all';
    AppConstants.FETCH_ORGANIZATION_BY_ID = '/setting/organization/get/';
    AppConstants.FETCH_ORG_ACCOUNT_URL = '/setting/organization/account';
    AppConstants.UPDATE_ORGANIZATION_URL = '/setting/organization/update/';
    ////////////////////// Patient URLs ///////////////////////////////
    AppConstants.FETCH_ALL_PATIENT_URL = '/patient/';
    AppConstants.PATIENT_DELETE_URI = '/patient/delete/';
    AppConstants.PATIENT_SAVE_URL = '/patient/save';
    AppConstants.PATIENT_FETCH_URL = '/patient/get/';
    AppConstants.PATIENT_UPDATE_URL = '/patient/update';
    AppConstants.SEARCH_ALL_PATIENT_URL = '/patient/search';
    AppConstants.GET_ALL_PATIENT_URL = '/patient/';
    AppConstants.UPLOAD_PATIENT_IMAGE_URL = '/patient/uploadProfileImg/';
    AppConstants.UPLOAD_PATIENT_FRONT_IMAGE_URL = '/patient/uploadImageFront/insurance/';
    AppConstants.UPLOAD_PATIENT_BACK_IMAGE_URL = '/patient/uploadImageBack/insurance/';
    AppConstants.PATIENT_PROBLEM_FETCH_URL = '/patient/history/problem/';
    AppConstants.PATIENT_PROBLEM_FETCH_STATUS_URL = '/patient/history/problem/status/';
    AppConstants.PATIENT_PROBLEM_SAVE_URL = '/patient/history/problem/save';
    AppConstants.PATIENT_PROBLEM_GET_URL = '/patient/history/problem/get?';
    AppConstants.PATIENT_PROBLEM_UPDATE_URL = '/patient/history/problem/update';
    AppConstants.PATIENT_PROBLEM_DELETE_URI = '/patient/history/problem/delete/';
    AppConstants.ALLERGY_SAVE_URL = '/patient/allergy/save';
    AppConstants.ALLERGY_PAGINATED_URL = '/patient/allergy/';
    AppConstants.ALLERGY_PAGINATED_STATUS_URL = '/patient/allergy/status/';
    AppConstants.ALLERGY_GET_URL = '/patient/allergy/get?';
    AppConstants.ALLERGY_UPDATE_URL = '/patient/allergy/update';
    AppConstants.ALLERGY_DELETE_URI = '/patient/allergy/delete/';
    //////////////////// Medication  ////////////////////////////////
    AppConstants.MEDICATION_SAVE_URL = '/patient/medication/save';
    AppConstants.MEDICATION_PAGINATED_URL = '/patient/medication/';
    AppConstants.MEDICATION_PAGINATED_STATUS_URL = '/patient/medication/status';
    AppConstants.MEDICATION_GET_URL = '/patient/medication/get?';
    AppConstants.MEDICATION_UPDATE_URL = '/patient/medication/update';
    AppConstants.MEDICATION_DELETE_URI = '/patient/medication/delete/';
    AppConstants.PAGINATED_URL = '/patient/medication/paginated';
    //////////////////// DOCUMENT  ////////////////////////////////
    AppConstants.DOCUMENT_SAVE_URL = '/patient/document/save';
    AppConstants.DOCUMENT_PAGINATED_URL = '/patient/document/';
    AppConstants.DOCUMENT_GET_URL = '/patient/document/get?';
    AppConstants.DOCUMENT_UPDATE_URL = '/patient/document/update';
    AppConstants.DOCUMENT_DELETE_URI = '/patient/document/delete/';
    ////////////////////// Appointments URLs ///////////////////////////////
    AppConstants.FETCH_PAGINATED_APPOINTMENTS_URL = '/appointment/';
    AppConstants.CREATE_APPOINTMENT_URL = '/appointment/create';
    AppConstants.SEARCH_APPOINTMENT_URL = '/appointment/search/';
    AppConstants.FETCH_APPOINTMENTS_BY_ID = '/appointment/get/';
    AppConstants.UPDATE_APPOINTMENT = '/appointment/update/';
    AppConstants.DELETE_APPOINTMENT_URI = '/appointment/delete/';
    AppConstants.FETCH_APPOINTMENTS_URL = '/appointment/';
    ////////////////////// Dashboard URLs ///////////////////////////////
    AppConstants.FETCH_DASHBOARD_URL = '/dashboard/';
    AppConstants.CHANGE_APPT_STATUS = '/dashboard/changestatus/';
    ////////////////////// Patient History ///////////////////////////////
    AppConstants.FETCH_ALL_LABORDER_URL = '/patient/laborder/';
    AppConstants.FETCH_LABORDER_BY_ID = '/patient/laborder/get/';
    AppConstants.LAB_ORDER_UPDATE = '/patient/laborder/update/';
    AppConstants.LAB_ORDER_DELETE = '/patient/laborder/delete/';
    AppConstants.FETCH_ALL_ORDER_BY_PATIENT_URL = '/patient/laborder/order/';
    ///////////////////Family History//////////
    AppConstants.FAMILY_HISTORY_CREATE = '/patient/family/create';
    AppConstants.FETCH_ALL_FAMILY_HISTORY_URL = '/patient/family/';
    AppConstants.LAB_ORDER_CREATE = '/patient/laborder/create';
    AppConstants.UPDATE_FAMILY_HISTORY_URL = '/patient/family/update/';
    AppConstants.FAMILY_HISTORY_DELETE = '/patient/family/delete/';
    AppConstants.FETCH_ALL_FAMILY_HISTORY_BY_PATIENT_URL = '/patient/family/history/';
    ///////////////////////Smoke Status URLs//////////////////////////////
    AppConstants.SMOKE_STATUS_URL = '/patient/smokeStatus/addUpdate';
    AppConstants.SMOKE_STATUS_DEL_URL = '/patient/smokeStatus/delete/';
    return AppConstants;
}());
exports.AppConstants = AppConstants;
//# sourceMappingURL=app.constants.js.map