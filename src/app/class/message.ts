export class message{
    _status: string='';
    _message: string='';

    get status(): string{
        return this._status;
    }
    set status(value: string){
        this._status= value;
    }
    get message(): string{
        return this._message;
    }
    set message(value: string){
        this._message= value;
    }
}