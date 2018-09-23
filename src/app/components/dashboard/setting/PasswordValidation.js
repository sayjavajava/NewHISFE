"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomValidators = /** @class */ (function () {
    function CustomValidators() {
    }
    CustomValidators.Match = function (firstControlName, secondControlName) {
        return function (AC) {
            var firstControlValue = AC.get(firstControlName).value; // to get value in input tag
            var secondControlValue = AC.get(secondControlName).value; // to get value in input tag
            if (firstControlValue != secondControlValue) {
                AC.get(secondControlName).setErrors({ MatchFields: true });
                console.log(false);
            }
            else {
                console.log(true);
                return null;
            }
        };
    };
    return CustomValidators;
}());
exports.CustomValidators = CustomValidators;
//# sourceMappingURL=PasswordValidation.js.map