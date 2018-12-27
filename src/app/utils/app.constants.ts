/**
 * @Author waqas kamran
 * @since 07-Sep-17
 * @Description Application Constants
 */
export class AppConstants {

    public static ACCESS_TOKEN = 'access_token';
    public static EXPIRE_PASSWORD_TOKEN = 'expire_password_token';
    public static USER_BY_ROLE = '/user/role';
    public static FETCH_ALL_CLINICAL_DEPARTMENTS_URI = '/setting/department/';///only active departments
    public static FETCH_ALL_CLINICAL_DEPARTMENTS_BY_BRANCHES_IDs_URI = '/setting/department/branches';///
    public static FETCH_ALL_DEPARTMENT_BY_BRANCH = '/user/department/';
    public static DELETE_CLINICAL_DEPARTMENTS_URI = '/setting/department/delete/';
    public static SEARCH_CLINICAL_DEPARTMENT_URL = '/setting/department/search/';
    public static SAVE_CLINICAL_DEPARTMENT_URL = '/setting/department/save';
    public static UPDATE_CLINICAL_DEPARTMENT_URL = '/setting/department/update';
    public static CREATE_USER_ENDPOINT = '/user/add';
    public static USER_SEARCH = '/user/search/';
    public static FETCH_ALL_USERS_URI = '/user/';
    public static FETCH_ALL_USERS = '/user/all';
    public static FETCH_USER_BY_ID = '/user/get/';
    ////////////////////// Branch URLs ///////////////////////////////
    public static ADD_BRANCH = '/setting/branch/create';
    public static UPDATE_BRANCH = '/setting/branch/update/';
    public static DELETE_BRANCH_URI = '/setting/branch/delete/';
    public static BRANCHES_NAME = '/setting/branch/name';
    public static BRANCH_SEARCH = '/setting/branch/search/';
    public static FETCH_ALL_BRANCHES_URL = '/setting/branch/';
    public static FETCH_ALL_BRANCHES_ALL_URL = '/setting/branch/all';
    public static FETCH_ALL_BRANCHES_WITH_DOCTOR_URL = '/setting/branch/branchdoctors';
    public static FETCH_BRANCHES_BY_ID = '/setting/branch/get/';
    public static FETCH_ALL_BRANCHES_WITH_DOCTORS = '/setting/branch/doctorsInBranch/';
    public static FETCH_ROOM_COUNT_OF_BRANCH = '/setting/branch/rooms/';
    public static FETCH_LIST_OF_COUNTRIES = '/setting/branch/countries/';
    public static FETCH_LIST_OF_STATES_BY_CNTRY_ID = '/setting/branch/states/';
    public static FETCH_LIST_OF_CITIES_BY_STATE_ID = '/setting/branch/cities/';
    public static FETCH_CITY_STATE_CNTRY_BY_BR_ID = '/setting/branch/cityStateCountry/';

    ////////////////////// Patients Invoices ///////////////////////////////
    public static SAVE_INVOICE = '/invoice/saveInvoice';
    public static GET_INVOICE_ITEMS = '/invoice/getInvoiceItemsById/';
    public static INVOICE_CHECK_IN = '/invoice/generateInvoiceOnCheckIn/';
    public static PATIENT_ALLINVOICE_BALANCE = '/invoice/getPatientInvBal/';

    ////////////////////// Cashier Desk ///////////////////////////////
    public static GET_All_INVOICES = '/cashier/getAllInvoices';
    public static GET_All_PENDING_INVOICES = '/cashier/getPendingInvoices';
    public static FETCH_APPOINTMENTS_BY_INOVICE_ID = '/cashier/getAppointmentByInvoiceId/';
    public static SAVE_PAYMENT = '/cashier/savePayment';

    ////////////////////// ICD URLs ///////////////////////////////
    public static ICD_CODE = '/setting/icd/code';
    public static ICD_CODE_GET = '/setting/icd/code/get?codeId=';
    public static ICD_CODE_SAVE_URL = '/setting/icd/code/save';
    public static ICD_CODE_UPDATE_URL = '/setting/icd/code/update';
    public static ICD_CODES = '/setting/icd/codes/';
    public static ICD_CODES_DATA_TABLE = '/setting/icd/codes/dataTable';
    public static ICD_CODES_ASSOCIATED_BY_VERSION_ID = '/setting/icd/codes/associated/?versionId=';
    public static ICD_CODE_DELETE_URL = '/setting/icd/code/delete?codeId=';
    public static ICD_CODE_SEARCH = '/setting/icd/code/search/';
    public static ICD_VERSION_SAVE_URL = '/setting/icd/version/save';
    public static ICD_VERSION_UPDATE_URL = '/setting/icd/version/update';
    public static ICD_VERSIONS = '/setting/icd/versions/';
    public static ICD_VERSIONS_DATA_TABLE = '/setting/icd/versions/dataTable';
    public static ICD_VERSIONS_BY_CODE_URL = '/setting/icd/versions/associated?codeId=';
    public static ICD_VERSION_DELETE_URL = '/setting/icd/version/delete?iCDVersionId=';
    public static ICD_VERSION_SEARCH = '/setting/icd/version/search/';
    public static ICD_CODE_VERSION_SAVE_URL = '/setting/icd/codeVersion/save';
    public static ICD_CODE_VERSIONS = '/setting/icd/codeVersions/';
    public static ICD_CODE_VERSION_DELETE_URL = '/setting/icd/codeVersion/delete?associateICDCVId=';
    public static ICD_CODE_VERSION_SEARCH = '/setting/icd/codeVersion/search/';
    public static ICD_VERSION_CODES_VERSION = '/setting/icd/version/codes/?versionId=';
    public static IMPORT_ICD_CODE_LIST_TO_SERVER = '/setting/icd/importRecords';

    public static ROLE_ENDPOINT = '/user/auth/addRole';
    public static PERMISSION_ENDPOINT = '/user/auth/authorities';
    public static PERMISSION_BY_ROLE = '/user/auth/permission';
    public static ASSIGN_PERMISSIONS_TO_ROLES = '/user/auth/assignAuthorities';

    public static USER_ALL_PERMISSIONS = '/user/auth/userDBPermissions';//dashboard related user's all permissions
    public static PERMISSION_BY_USER = '/user/auth/userPermissions/';
    public static ASSIGN_PERMISSIONS_TO_USERS = '/user/auth/assignUserPermissions';

    ////////////////////// Service Tax URLs ///////////////////////////////
    public static FETCH_ALL_TAX_URL = '/setting/tax/';
    public static FETCH_ALL_TAX_DATA_TABLE_URL = '/setting/tax/dataTable';
    public static SERVICE_TAX_SAVE_URL = '/setting/tax/save';
    public static SERVICE_TAX_DELETE_URL = '/setting/tax/delete?taxId=';
    public static SERVICE_TAX_UPDATE_URL = '/setting/tax/update';
    public static SERVICE_TAX_SEARCH_URL = '/setting/tax/search/';

    ////////////////////// Email Template URLs ///////////////////////////////
    public static EMAIL_TEMPLATE_FETCH_ALL_URL = '/setting/emailTemplate/';
    public static EMAIL_TEMPLATE_DELETE_URL = '/setting/emailTemplate/delete/?id=';
    public static EMAIL_TEMPLATE_SAVE_URL = '/setting/emailTemplate/save';
    public static EMAIL_TEMPLATE_EDIT_URL = '/setting/emailTemplate/get/';
    public static EMAIL_TEMPLATE_UPDATE_URL = '/setting/emailTemplate/update';
    public static EMAIL_TEMPLATE_SEARCH_URL = '/setting/emailTemplate/search/';

    ////////////////////// Medical Service URLs ///////////////////////////////
    public static FETCH_ALL_MEDICAL_SERVICES_URL = '/setting/medicalService/';//all only active or if by /1 or 0 or some number then paging method call
    public static SAVE_MEDICAL_SERVICES_URL = '/setting/medicalService/save';
    public static UPDATE_MEDICAL_SERVICES_URL = '/setting/medicalService/update';
    public static DELETE_MEDICAL_SERVICES_URL = '/setting/medicalService/delete?';
    public static FETCH_MEDICAL_SERVICES_BY_ID_URL = '/setting/medicalService/id/';
    public static MEDICAL_SERVICE_SEARCH = '/setting/medicalService/search/';
    public static FETCH_DEPARTMENTS_BY_MEDICAL_SERVICE_ID_URL = '/setting/medicalService/departments/';
    public static FETCH_BRANCHES_BY_MEDICAL_SERVICE_ID_URL = '/setting/medicalService/branches/';

    public static FETCH_DEPT_MEDICAL_SERVICES_URL = '/setting/medicalService/getDeptMedicalService/';

    ////////////////////// Organization URLs ///////////////////////////////
    public static ORGANIZATION_CREATE_URL = '/setting/organization/create';
    public static TIMEZONE_FETCH_URL = '/setting/organization/timezone';
    public static FETCH_ALL_ORGANIZATION_URL_PAGINATED = '/setting/organization/';
    public static FETCH_ALL_ORGANIZATION_URL = '/setting/organization/all';
    public static FETCH_ORGANIZATION_BY_ID = '/setting/organization/get/';
    public static FETCH_ORG_ACCOUNT_URL = '/setting/organization/account';
    public static UPDATE_ORGANIZATION_URL = '/setting/organization/update/';

    ////////////////////// Patient URLs ///////////////////////////////
    public static FETCH_ALL_PATIENT_URL = '/patient/';
    public static PATIENT_DELETE_URI = '/patient/delete/';
    public static PATIENT_SAVE_URL = '/patient/save';
    public static PATIENT_FETCH_URL = '/patient/get/';
    public static PATIENT_UPDATE_URL = '/patient/update';
    public static SEARCH_ALL_PATIENT_URL = '/patient/search';
    public static GET_ALL_PATIENT_URL = '/patient/';
    public static IMPORT_PATIENTS_LIST_TO_SERVER = '/patient/importPatientRecords';
    public static UPLOAD_PATIENT_IMAGE_URL = '/patient/uploadProfileImg/';
    public static UPLOAD_PATIENT_FRONT_IMAGE_URL = '/patient/uploadInsuranceFrontImg/';//'/patient/uploadImageFront/insurance/';
    public static UPLOAD_PATIENT_BACK_IMAGE_URL = '/patient/uploadInsuranceBackImg/';//'/patient/uploadImageBack/insurance/';
    public static PATIENT_PROBLEM_FETCH_URL = '/patient/history/problem/';
    public static PATIENT_PROBLEM_FETCH_STATUS_URL = '/patient/history/problem/status/';
    public static PATIENT_PROBLEM_SAVE_URL = '/patient/history/problem/save';
    public static PATIENT_PROBLEM_GET_URL = '/patient/history/problem/get?';
    public static PATIENT_PROBLEM_UPDATE_URL = '/patient/history/problem/update';
    public static PATIENT_PROBLEM_DELETE_URI = '/patient/history/problem/delete/';

    public static ALLERGY_SAVE_URL = '/patient/allergy/save';
    public static ALLERGY_PAGINATED_URL = '/patient/allergy/';
    public static ALLERGY_PAGINATED_STATUS_URL = '/patient/allergy/status/';
    public static ALLERGY_GET_URL = '/patient/allergy/get?';
    public static ALLERGY_UPDATE_URL = '/patient/allergy/update';
    public static ALLERGY_DELETE_URI = '/patient/allergy/delete/';

    //////////////////// Medication  ////////////////////////////////
    public static MEDICATION_SAVE_URL = '/patient/medication/save';
    public static MEDICATION_PAGINATED_URL = '/patient/medication/';
    public static MEDICATION_PAGINATED_STATUS_URL = '/patient/medication/status/';
    public static MEDICATION_GET_URL = '/patient/medication/get?';
    public static MEDICATION_UPDATE_URL = '/patient/medication/update';
    public static MEDICATION_DELETE_URI = '/patient/medication/delete/';
    public static PAGINATED_URL = '/patient/medication/paginated';

    //////////////////// DOCUMENT  ////////////////////////////////
    public static DOCUMENT_SAVE_URL = '/patient/document/save';
    public static DOCUMENT_PAGINATED_URL = '/patient/document/';
    public static DOCUMENT_GET_URL = '/patient/document/get?';
    public static DOCUMENT_UPDATE_URL = '/patient/document/update';
    public static DOCUMENT_DELETE_URI = '/patient/document/delete/';


    ////////////////////// Appointments URLs ///////////////////////////////
    public static FETCH_PAGINATED_APPOINTMENTS_URL = '/appointment/';
    public static CREATE_APPOINTMENT_URL = '/appointment/create';
    public static SEARCH_APPOINTMENT_URL = '/appointment/search/';
    public static SEARCH_APPOINTMENTS_BY_PATIENT = '/appointment/patient/appointments/'
    public static FETCH_APPOINTMENTS_BY_ID = '/appointment/get/';
    public static UPDATE_APPOINTMENT = '/appointment/update/';
    public static DELETE_APPOINTMENT_URI = '/appointment/delete/';
    public static UPDATE_APPOINTMENT_ROOM = '/appointment/update/room/';
    public static FETCH_APPOINTMENTS_URL = '/appointment/';
    public static FETCH_MEDICALSERVICES_WITH_DOCTORS = '/appointment/doctor/services';
    public static IMPORT_APPOINTMENT_LIST_TO_SERVER = '/appointment/importRecords';

    ////////////////////// Dashboard URLs ///////////////////////////////
    public static FETCH_DASHBOARD_URL = '/dashboard/';
    public static CHANGE_APPT_STATUS = '/dashboard/changestatus/';

    ////////////////////// Patient History ///////////////////////////////
    public static FETCH_ALL_LABORDER_URL = '/patient/laborder/';
    public static FETCH_LABORDER_BY_ID = '/patient/laborder/get/';
    public static LAB_ORDER_UPDATE = '/patient/laborder/update/';
    public static LAB_ORDER_DELETE = '/patient/laborder/delete/';
    public static FETCH_ALL_ORDER_BY_PATIENT_URL = '/patient/laborder/order/';
    public static FETCH_ALL_ORDER_BY_PATIENT_URL_NEW = '/patient/laborder/order/';
    //public static FETCH_ALL_ORDERTEST_BY_PATIENT_URL = '/patient/laborder/orderId/';
    public static FETCH_ALL_ORDERTEST_BY_PATIENT_URL = '/patient/laborder/orderId?orderId=';
    ///////////////////Family History//////////
    public static FAMILY_HISTORY_CREATE = '/patient/family/create';
    public static FETCH_ALL_FAMILY_HISTORY_URL = '/patient/family/';
    public static LAB_ORDER_CREATE = '/patient/laborder/create';
    public static UPDATE_FAMILY_HISTORY_URL = '/patient/family/update/';
    public static FAMILY_HISTORY_DELETE = '/patient/family/delete/';
    public static FETCH_ALL_FAMILY_HISTORY_BY_PATIENT_URL = '/patient/family/all';
    ///////////////////////Smoke Status URLs//////////////////////////////
    public static SMOKE_STATUS_URL = '/patient/smokeStatus/addUpdate';
    public static SMOKE_STATUS_DEL_URL = '/patient/smokeStatus/delete/';

    ///////////////////Family History//////////
    public static STATUS_CREATE = '/setting/status/create';
    public static FETCH_ALL_PAGINATED_STATUS = '/setting/status/';
    public static STATUS_DELETE = '/setting/status/delete/';
    public static UPDATE_STATUS_URL = '/setting/status/update/';
    public static STATUS_SEARCH = '/setting/status/search/';
    public static BRANCH_ORGANIZATION = '/setting/branch/organization';
    public static FETCH_ALL_STATUSES= '/setting/status/allStatus';


    ////////////////////// Email Configuration URLs ///////////////////////////////
    public static FETCH_EMAIL_CONFIGURATIONS = '/emailConfiguration/getAll';
    public static EMAIL_CONFIGURATION_SMTPS_SAVE = '/emailConfiguration/saveSMTP';
    public static EMAIL_CONFIGURATION_SES_SAVE = '/emailConfiguration/saveSES';


    ////////////////////// SMS Template Configuration URLs ///////////////////////////////
    public static FETCH_SMS_CONFIGURATIONS = '/smsConfiguration/getAll';
    public static FETCH_SMS_CONFIG_BY_ID = '/smsConfiguration/getSmsById?id=';
    public static SMS_CONFIGURATION_SAVE = '/smsConfiguration/saveSmsConfiguration';
    public static SMS_CONFIGURATION_DELETE_SAVE = '/smsConfiguration/deleteSmsConfig?id=';


    ////////////////////// Prefix Configuration URLs ///////////////////////////////
    public static FETCH_PREFIX_CONFIGURATIONS = '/prefixConfiguration/getAll';
    public static PREFIX_CONFIGURATION_SAVE = '/prefixConfiguration/savePrefixConfiguration';


    ////////////////////// Chart Of Account Configuration URLs ///////////////////////////////
    public static FETCH_ACCOUNTS_CONFIGURATIONS = '/chartOfAccountConfigurations/getAll';
    public static ACCOUNTS_CONFIGURATION_SAVE = '/chartOfAccountConfigurations/saveChartOfAccount';

    public static ASSETS_CONFIG_SAVE = '/chartOfAccountConfigurations/updateAssetsConfig';
    public static LIABILTY_CONFIG_SAVE = '/chartOfAccountConfigurations/updateLiabilityConfig';
    public static REVENUE_CONFIG_SAVE = '/chartOfAccountConfigurations/updateRevenueConfig';
    public static COS_CONFIG_SAVE = '/chartOfAccountConfigurations/updateCOSConfig';
    public static EXPENSE_CONFIG_SAVE = '/chartOfAccountConfigurations/updateExpenseConfig';

    public static FETCH_ACCOUNT_CODE = '/chartOfAccountConfigurations/accountCode';
    public static DELETE_ACCOUNT_URL = '/chartOfAccountConfigurations/delete/';

    ////////////////////// Vital Setup Configuration URLs ///////////////////////////////
    public static FETCH_VITALS_CONFIGURATIONS = '/vitalSetup/getSetup';
    public static VITALS_CONFIGURATION_SAVE = '/vitalSetup/saveVitalSetup';
    public static VITALS_CONFIGURATION_DELETE = '/vitalSetup/delete/';


    ////////////////////// Lab Test speciman Setup Configuration URLs ///////////////////////////////
    public static FETCH_LAB_TEST_SPECIMAN_CONFIGURATIONS = '/labTest/getAll';
    public static LAB_TEST_SPECIMAN_CONFIGURATION_SAVE = '/labTest/saveLabTestSpeciman';
    public static IMPORT_LAB_TEST_LIST_TO_SERVER = '/labTest/importRecords';
  // public static DRUG_DELETE_URI = '/setting/drug/delete?drugId=';
    public static LAB_TEST_SPECIMAN_CONFIGURATION_DELETE = '/labTest/delete?specimanId=';
    public static LAB_TEST_UPDATE_URL = '/labTest/update';
    ///////////////////// Patient Group URLs ////////////////////////////////////////
    public static PATIENT_GROUP_FETCH_ALL_PAGINATED_URI = '/patient/group/';///all by paginated , zero means first page , 1 means second page
    public static PATIENT_GROUP_DELETE_URI = '/patient/group/delete?patientGroupId=';
    public static PATIENT_GROUP_SEARCH_URL = '/patient/group/search/';
    public static PATIENT_GROUP_SAVE_URL = '/patient/group/save';
    public static PATIENT_GROUP_UPDATE_URL = '/patient/group/update';
    public static PATIENT_GROUP_GET_URL = '/patient/group/get?patientGroupId=';
    public static PATIENT_GROUP_GET_ALL = '/patient/group/get/all';


    ///////////////////// Drug URLs ////////////////////////////////////////
    public static DRUG_FETCH_ALL_PAGINATED_URI = '/setting/drug/';///all by paginated
    public static DRUG_DELETE_URI = '/setting/drug/delete?drugId=';
    public static DRUG_SEARCH_URL = '/setting/drug/search/';
    public static DRUG_SAVE_URL = '/setting/drug/save';
    public static DRUG_UPDATE_URL = '/setting/drug/update';
    public static DRUG_GET_URL = '/setting/drug/get?drugId=';
    public static DRUG_SEARCH_BY_NAME_URL = '/setting/drug/search?drugName=';
    public static DRUG_GET_ALL_URL = '/setting/drug/all';
    public static DRUG_GET_NATURAL_ID_URL = '/setting/drug/natural';// get natural id only
    public static IMPORT_DRUGS_LIST_TO_SERVER = '/setting/drug/importRecords';

    ///////////////////// Currency URLs ////////////////////////////////////////
    public static CURRENCY_FETCH_ALL_PAGINATED_URI = '/setting/currency/';///all by paginated , zero means first page , 1 means second page
    public static CURRENCY_DELETE_URI = '/setting/currency/delete?currencyId=';
    public static CURRENCY_SEARCH_URL = '/setting/currency/search/';
    public static CURRENCY_SAVE_URL = '/setting/currency/save';
    public static CURRENCY_UPDATE_URL = '/setting/currency/update';
    public static CURRENCY_GET_URL = '/setting/currency/get?currencyId=';


    //////////////Payment Type ///////////////////////////////////
    public static GET_ALL_PAYMENTTYPE = '/PaymentType/';
    public static SAVE_PAYMENTTYPE = '/PaymentType/save';
    public static DELETE_PAYMENTTYPE = '/PaymentType/delete/';
    public static UPDATE_PAYMENTTYPE = '/PaymentType/update';


    public static GET_ALL_PAYMENT_TYPE = '/PaymentType/getListPaymentType';



    //////////////Payment API for Receipt ///////////////////////////////////
    public static SAVE_ADVANCE_PAYMENT = '/payment/saveAdvancePayment';
    public static GET_INVOICE_List_BY_PAT_ID = '/payment/getPatientInvoiceListById/';

    public static GET_PAYMENT_ID = '/payment/getPaymentId';

    public static SAVE_BULK_RECEIT = '/payment/saveBulkReceit';
    public static GET_RECEIPT_List = '/payment/getReceiptList';


    public static REFUND_PAYMENT = '/refundApi/refundPayment';
    public static REFUND_LIST_DATA = '/refundApi/getRefundList';
    public static GET_REFUND_ID = '/refundApi/getRefundId';


    public static SAVE_DOCTOR_PAYMENT = '/doctorPayment/save';
    public static GET_DOCTOR_PAYMENT_List = '/doctorPayment/getPaymentList';

    public static GET_DOCTOR_List = '/doctorPayment//doctorsWithCommission';

    ////////////////Country/////////////////////////////
    public static GET_ALL_COUNTRY = '/CountryAPI/';
    public static GET_STATE_BYCOUNTRYID = '/StateAPI/get/';
    public static GET_CITY_BYSTATEID = '/CityAPI/get/';
    public static GET_ALL_DATEFORMAT = '/common/';
    public static ZONE_FETCH_URL = '/common/timezoneApi';
    public static GET_CITY_URL = '/CityAPI/';
    public static GET_STATE_URL = '/StateAPI/';
    public static GET_ALL_COUNTRYBYID = '/CountryAPI/get/';

    public static ORGANIZATION_DATA_URL = '/setting/organization/OrganizationData';
    public static FETCH_ACCOUNTS_PAYMENTTYPE = '/chartOfAccountConfigurations/getAllForPaymentType';
    /////////////////////FETCH
    public static FETCH_NAME_ROUTE = '/setting/drug/searchName?drugName=';

    public static FETCH_NAME_STRENGTHS = '/setting/drug/searchStrengths?drugName=';


    ////////////////////////////////
    public static FETCH_VITALS_PATIENT = '/PatientVital/getPatientVital';
    public static VITALS_PATIENT_SAVE = '/PatientVital/savePatientVital';
    public static DELETE_VITAL = '/PatientVital/delete/';
    public static VITAL_GET_URL = '/PatientVital/get/';
    public static VITALS_PATIENT_UPDATE = '/PatientVital/update';
    public static VITALS_PAGINATED_URL = '/PatientVital/';
    public static VITALS_PATIENT_SAVE_LIST = '/PatientVital/savePatientVitalList';

    ///////////////////////////////////////////
    public static FETCH_PATIENT_IMAGE = '/PatientImage/getSetup';
    public static PATIENT_IMAGE_SAVE = '/PatientImage/savePatientImageSetup';
    public static DELETE_PATIENT_IMAGE = '/PatientImage/delete/';
    public static UPDATE_PATIENT_IMAGE = '/PatientImage/update';


    /*public static DOCUMENT_SAVE_URL = '/patient/document/save';
    public static DOCUMENT_PAGINATED_URL = '/patient/document/';
    public static DOCUMENT_GET_URL = '/patient/document/get?';
    public static DOCUMENT_UPDATE_URL = '/patient/document/update';
    public static DOCUMENT_DELETE_URI = '/patient/document/delete/';*/

    public static FETCH_PATIENT_ORDER = '/PatientImage/getSetup';
    public static PATIENT_IMAGE_SAVE_ORDER = '/patient/Imageorder/save';
    public static DELETE_PATIENT_IMAGE_DELETE = '/patient/Imageorder/delete/';
    public static UPDATE_PATIENT_IMAGE_UPDATE = '/patient/Imageorder/update';
    public static PATIENT_IMAGE_FETCH_ALL_PAGINATED_URI = '/patient/Imageorder/';///all by paginated
    public static FETCH_PATIENT_ORDER_IMAGES_ID = '/patient/Imageorder/getImages?';
    public static FETCH_PATIENT_ORDER_ID = '/patient/Imageorder/get?orderId=';
    public static PATIENT_IMAGES_FETCH_ALL_PAGINATED_URI = '/patient/Imageorder/getImagesOrderId/';
    /*****************************REPORT PRINT*************************************/
    public static PRINT_REFUND_RECEIPT = '/reportPrint/refundReceipt';
    public static PRINT_ADVANCED_PAYMENT_RECEIPT = '/reportPrint/advancePaymentReceipt';
    public static PRINT_PATIENT_PAYMENT_INVOICE = '/reportPrint/patientPaymentInvoice';
    public static PRINT_PATIENT_INVOICE_DETAILS = '/reportPrint/patientInvoice';
    public static FETCH_VITALS_CONFIGURATIONS_ID = '/PatientVital/get/';
    /*****************************FILE DOWNLOAD*************************************/
    public static ICD_CODE_DOWNLOAD_SAMPLE_FILE = '/fileDownload/icdCodeSample';

  //  public static PATIENT_IMAGE_FILES_URL = '/patient/get/'
}


