
export class  SMTPS{
    id: number;
    smtpHost: string = "";
    senderEmail: string = "";
    testReceiverEmail: string;
    smptPassword: string = "";
    smtpPort: string = "";
    systemDefault: boolean = false;

    serverType: string ="SMTP";

    constructor() {
    }
}