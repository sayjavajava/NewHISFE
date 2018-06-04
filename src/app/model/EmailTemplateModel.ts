export class EmailTemplateModel {
    private id: number;
    private title: string;
    private subject: string;
    private type: string = "Email Type A";
    private code: string;
    private emailTemplate: string;
    private active: boolean;
    private deleted: boolean;
    private updatedOn: number;
    private createdOn: number;

    constructor() {
    }
}
