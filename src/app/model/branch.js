"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Branch = (function () {
    function Branch(id, branchName, officeHoursStart, officeHoursEnd, noOfExamRooms, state, city, primaryDoctor, zipCode, address, officePhone, fax, formattedAddress, checked) {
        this.id = id;
        this.branchName = branchName;
        this.officeHoursStart = officeHoursStart;
        this.officeHoursEnd = officeHoursEnd;
        this.noOfExamRooms = noOfExamRooms;
        this.state = state;
        this.city = city;
        this.primaryDoctor = primaryDoctor;
        this.zipCode = zipCode;
        this.address = address;
        this.officePhone = officePhone;
        this.fax = fax;
        this.formattedAddress = formattedAddress;
        this.checkedBranch = checked;
    }
    return Branch;
}());
exports.Branch = Branch;
//# sourceMappingURL=branch.js.map