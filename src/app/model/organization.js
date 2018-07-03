"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Organization = (function () {
    function Organization(firstName, userName, companyName, password, email, confirmPassword, appointmentSerial, lastName, homePhone, cellPhone, officePhone, timeZone, specialty, website, defaultBranch, durationOfExam, followUpExam) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.companyName = companyName;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.homePhone = homePhone;
        this.cellPhone = cellPhone;
        this.officePhone = officePhone;
        this.timeZone = timeZone;
        this.specialty = specialty;
        this.appointmentSerial = appointmentSerial;
        this.website = website;
        this.defaultBranch = defaultBranch;
        this.durationOfExam = durationOfExam;
        this.followUpExam = followUpExam;
        this.email = email;
    }
    return Organization;
}());
exports.Organization = Organization;
//# sourceMappingURL=organization.js.map