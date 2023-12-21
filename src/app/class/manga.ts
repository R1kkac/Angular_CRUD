export class MangaClass{
    _MangaId: string='';
    _MangaName: string='';
    _MangaDetails: string='';
    _MangaImage: string='';
    _MangaAlternateName: string='';
    _MangaAuthor: string='';
    _MangaArtist: string='';
    _MangaGenre: string='';

    get mangaId(): string{
        return this._MangaId;
    }
    get mangaName(): string{
        return this._MangaName;
    }
    set mangaName(value: string){
        this._MangaName= value;
    }
    get mangaDetails(): string{
        return this._MangaDetails;
    }
    set mangaDetails(value: string){
        this._MangaDetails= value;
    }
    get mangaImage(): string{
        return this._MangaImage;
    }
    get mangaAlternateName(): string{
        return this._MangaAlternateName;
    }
    set mangaAlternateName(value: string){
        this._MangaAlternateName= value;
    }
    get mangaAuthor(): string{
        return this._MangaAuthor;
    }
    set mangaAuthor(value: string){
        this._MangaAuthor= value;
    }
    get mangaArtist(): string{
        return this._MangaArtist;
    }
    set mangaArtist(value: string){
        this._MangaArtist= value;
    }
    get mangaGenre(): string{
        return this._MangaGenre;
    }
    set mangaGenre(value: string){
        this._MangaGenre= value;
    }
    UpdateManga(MangaName: string, MangaDetails: string, MangaAlternateName: string, MangaAuthor: string, MangaArtist: string,
        MangaGenre: string)
    {
        this._MangaName= MangaName,
        this._MangaDetails= MangaDetails,
        this._MangaAlternateName= MangaAlternateName,
        this._MangaAuthor= MangaAuthor,
        this._MangaArtist= MangaArtist,
        this._MangaGenre= MangaGenre
    }
}