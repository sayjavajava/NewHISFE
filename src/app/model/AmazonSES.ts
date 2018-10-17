
export class  AmazonSES{
    id: number;
    sesAccessKey: string = "";
    sesSecretKey: string = "";
    senderEmail: string;
    testReceiverEmail: string;
    systemDefault: boolean = false;

    serverType: string ="SES";

    constructor(){
    }
}