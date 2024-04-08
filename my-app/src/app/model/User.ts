export class User {
    constructor(
        public email: string,
        public username: string,
        public password: string,
        public role: string,
        public id?: string,
    ){}
}