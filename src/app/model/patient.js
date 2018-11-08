"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by jamal on 6/7/2018.
 */
var Patient = (function () {
    function Patient() {
        this.selectedDoctor = -1;
        this.titlePrefix = "-1";
        this.firstName = "";
        this.middleName = "";
        this.lastName = "";
        this.foreignName = "";
        this.homePhone = "";
        this.cellPhone = "";
        this.disableSMSTxt = false;
        this.officePhone = "";
        this.officeExtension = "";
        this.email = "";
        this.userName = "";
        this.preferredCommunication = "ENGLISH";
        this.reminderLanguage = "ENGLISH";
        this.statusUser = true;
        this.primaryDoctorFirstName = "";
        this.primaryDoctorLastName = "";
        ////////Appointment
        this.pastAppointments = [];
        this.patientSSN = "";
        this.dob = "";
        this.gender = "MALE";
        /* races: Race[] = [
             {id: 1, nameRace: 'American Indian or Alaska Native', selected: false},
             {id: 2, nameRace: 'Asian', selected: false},
             {id: 3, nameRace: 'Black or African American', selected: false},
             {id: 4, nameRace: 'Native Hawaiian or Other Pacific Islam', selected: false},
             {id: 5, nameRace: 'White', selected: false},
             {id: 6, nameRace: 'Other Race', selected: false}
         ];*/
        this.races = [
            { label: 'American Indian or Alaska Native', value: 'American Indian or Alaska Native', selected: false },
            { label: 'Americian', value: 'Americian', selected: false },
            { label: 'Asian', value: 'Asian', selected: false },
            { label: 'Black or African American', value: 'Black or African American', selected: false },
            { label: 'White', value: 'White', selected: false },
            { label: 'Other Race', value: 'Other Race', selected: false },
        ];
        this.country = "SAUDI ARAB";
        this.streetAddress = "";
        this.zipCode = "";
        this.city = "";
        this.state = "SAUDI ARAB";
        this.formattedAddress = "";
        this.marital = "SINGLE";
        this.emergencyContactName = "";
        this.emergencyContactPhone = "";
        this.emergencyContactRelation = "";
        this.signatureOnFile = false;
        this.company = "";
        this.insuranceIdNumber = "";
        this.groupNumber = "";
        this.planName = "";
        this.planType = "";
        this.cardIssuedDate = "";
        this.cardExpiryDate = "";
        this.primaryInsuranceNotes = "";
        this.hasChild = false;
    }
    return Patient;
}());
exports.Patient = Patient;
//# sourceMappingURL=patient.js.map