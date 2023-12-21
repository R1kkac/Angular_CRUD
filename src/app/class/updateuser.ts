export class updateUser{
    private Email: string='';
    private OldPassword: string='';
    private NewPassword: string='';
    private PhoneNumber: string='';
    private Avatar: string='';
    private Name: string='';
    newUpdateUser(email: string, oldpass: string, newpass: string, phone: string, avatar: string,name: string){
        this.Email=email;
        this.OldPassword=oldpass,
        this.NewPassword=newpass;
        this.PhoneNumber=phone;
        this.Avatar=avatar;
        this.Name=name;
    }
}