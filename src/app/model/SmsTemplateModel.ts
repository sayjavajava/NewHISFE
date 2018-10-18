export class SmsTemplateModel {
    id: number;
    subject: string = '';
    type: string = '-1';
    smsTemplate: string = '';
    active: boolean = false;

    constructor() {
    }
}
