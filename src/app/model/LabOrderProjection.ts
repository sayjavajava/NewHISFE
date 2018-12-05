export  class  LabOrderProjection{

    id: number;
  //  testCode: string = '';
 //   testName: string = '';
 //   minNormalRange: string = '';
//    maxNormalRange: string = '';
    comments: string = '';
    dateTest:Date=new Date();
    status:string;
    unit:string='';
 //   resultValue:string='';
    labTests:any[]=[];
    constructor() {
    }
}