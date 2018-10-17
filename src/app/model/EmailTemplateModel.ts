export class EmailTemplateModel {
    id: number;
    title: string = '';
    subject: string = '';
    type: string = '-1';
    code: string = '';
    emailTemplate: string = '';
    active: boolean = true;
    deleted: boolean;
    updatedOn: number;
    createdOn: number;

    constructor() {
    }
}
