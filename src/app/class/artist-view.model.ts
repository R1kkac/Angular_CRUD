export interface ArtistView {
    mangaArtistId: number;
    name?: string;
    birthday?: string;
    alternateName?: string;
    artistImage?: string;

  }

  export interface Artist {
    mangaArtistId: number;
    name?: string;
    birthday?: string;
    alternateName?: string;
    artistImage?: string;
    boTruyens: [];
  }