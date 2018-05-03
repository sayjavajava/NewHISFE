export class RoleAndPermission {
    id: number;
    name: string;
    description: string;
    active: boolean;
    type: string;
    assigned: boolean = false;

    constructor(name: string, description: string, isActive: boolean, type: string) {
        this.name = name;
        this.description = description;
        this.active = isActive;
        this.type = type;
    }

}