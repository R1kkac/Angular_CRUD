export class loginUser{
    private UserName: string;
    private Password: string;

    constructor(username: string='', password: string='')
    {
        this.UserName=username;
        this.Password=password;
    }
    get username(): string{
        return this.UserName;
    }
    set username(value: string){
        this.UserName= value;
    }
    get password(): string{
        return this.Password;
    }
    set password(value: string){
        this.Password= value;
    }
}