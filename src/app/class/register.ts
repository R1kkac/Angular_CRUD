
export class Register{
    private UserName: string;
    private Password: string;
    private Email: string;
    private PhoneNumber: string;
    private Name: string;

    constructor(username: string='', password: string='', email: string='', phonenumber: string='', nameView: string=''){
        this.UserName=username;
        this.Password=password;
        this.Email=email;
        this.PhoneNumber=phonenumber;
        this.Name=nameView
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
    get email(): string{
        return this.Email;
    }
    set email(value: string){
        this.Email= value;
    }
    get phonenumber(): string{
        return this.PhoneNumber;
    }
    set phonenumber(value: string){
        this.PhoneNumber= value;
    }
    get nameView(): string{
        return this.Name;
    }
    set nameView(value: string){
        this.Name= value;
    }
}