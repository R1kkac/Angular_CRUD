export class user{
    private id: string;
    private avatar: string;
    private name: string;
    private email: string;
    private phoneNumber: string;

    constructor(Id: string='', Avatar: string='', Name: string='', Email: string='', PhoneNumber: string=''){
        this.id=Id;
        this.avatar=Avatar;
        this.name=Name;
        this.email=Email;
        this.phoneNumber=PhoneNumber
    }
    get _Id(): string{
        return this.id;
    }
    set _Id(value: string){
        this.id= value; 
    }
    get _Avatar(): string{
        return this.avatar;
    }
    set _Avatar(value: string){
        this.avatar= value;
    }
    get _Name(): string{
        return this.name;
    }
    set _Name(value: string){
        this.name= value;
    }
    get _Email(): string{
        return this.email;
    }
    set _Email(value: string){
        this.email= value;
    }
    get _PhoneNumber(): string{
        return this.phoneNumber;
    }
    set _PhoneNumber(value: string){
        this.phoneNumber= value;
    }
    public updateUserInfo(Id: string, Avatar: string, Name: string, Email: string, PhoneNumber: string): void {
        this._Id = Id;
        this._Avatar = Avatar;
        this._Name = Name;
        this._Email = Email;
        this._PhoneNumber = PhoneNumber;
      }
}