import { chapterView2 } from "./ChapterView";

export interface botruyenView {
    MangaId?: string;
    MangaName?: string;
    MangaDetails?: string;
    MangaImage?: string;
    MangaAlternateName?: string;
    MangaAuthor?: string;
    MangaArtist?: string;
    MangaGenre?: string;
    Dateupdate?: string;
    Rating?: string;
    View?: string;
    Status?: boolean;
    ListChaper?: chapterView2[];
    Listcategory?: TheLoai[];
  }
  
  export interface TheLoai {
    GenreId: number;
    GenresIdName?: string;
    Info?: string;
  }