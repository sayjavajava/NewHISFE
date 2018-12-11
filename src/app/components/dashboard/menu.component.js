"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var requests_service_1 = require("../../services/requests.service");
var platform_browser_1 = require("@angular/platform-browser");
var items_1 = require("../../model/items");
var MenuComponent = (function () {
    function MenuComponent(requestsService, router, titleService) {
        this.requestsService = requestsService;
        this.router = router;
        this.titleService = titleService;
        this.showMenuBar = false;
        this.items = [];
        this.collapseMenu = true;
        this.collapsed = false;
    }
    ;
    MenuComponent.prototype.ngOnInit = function () {
        if (!window.localStorage.getItem(btoa('access_token'))) {
            this.router.navigate(['/login']);
        }
        else {
            this.userPermissions = JSON.parse(atob(window.localStorage.getItem(btoa('permissions'))));
            var itemsList_1 = [];
            var gList_1 = [];
            var mList_1 = [];
            var gInd_1;
            var sInd_1;
            var mInd_1;
            this.userPermissions.forEach(function (x) {
                if (x.indicatior == 'G') {
                    var ob2 = new items_1.items(x.name, x.routeUrl, x.permissionIcon);
                    itemsList_1.push(ob2);
                    gInd_1 = new items_1.items('Genaral', '', 'fa fa-cog', itemsList_1);
                }
                if (x.indicatior == 'S') {
                    var ob3 = new items_1.items(x.name, x.routeUrl);
                    gList_1.push(ob3);
                    sInd_1 = new items_1.items('Other', '', '', gList_1);
                }
                if (x.indicatior == 'C') {
                    var ob3 = new items_1.items(x.name, x.routeUrl);
                    mList_1.push(ob3);
                    mInd_1 = new items_1.items('Content', '', 'fa fa-code-fork', mList_1);
                }
            });
            this.items.push(gInd_1);
            this.items.push(mInd_1);
            this.items.push(sInd_1);
        }
        this.titleService.setTitle('HIS | Dashboard');
        var userType = atob(localStorage.getItem(btoa('user_type')));
        if (userType === 'admin' || userType === 'manager')
            this.showMenuBar = true;
    };
    MenuComponent.prototype.changeMenu = function () {
        console.log('Change menu');
        this.collapseMenu = !this.collapseMenu;
    };
    MenuComponent = __decorate([
        core_1.Component({
            selector: 'menu-component',
            templateUrl: '../../templates/dashboard/menu.template.html',
            styleUrls: [],
        }),
        __metadata("design:paramtypes", [requests_service_1.RequestsService,
            router_1.Router,
            platform_browser_1.Title])
    ], MenuComponent);
    return MenuComponent;
}());
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map