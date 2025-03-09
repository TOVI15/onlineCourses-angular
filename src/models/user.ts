export class UserLogin {
    constructor( public email: string,
   public password: string){}
}

export class User{
    constructor(public name: string,
        public email : string,
        public password : string,
        public role : Role){
    }
}

type Role = 'student' | 'teacher' | 'admin';


