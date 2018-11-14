"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ICDCodeModel = (function () {
    function ICDCodeModel() {
        this.code = '';
        this.problem = ''; //// title replaced by problem
        this.infoURL = '';
        this.status = true;
        this.hasChild = false;
        this.selectedVersions = [];
        this.checkedVersionCount = '';
        this.versionCountUnique = true; /// unique mean it has one version,if code has one version then we show its name if code has more thane one version then show total count
    }
    return ICDCodeModel;
}());
exports.ICDCodeModel = ICDCodeModel;
//# sourceMappingURL=ICDCodeModel.js.map