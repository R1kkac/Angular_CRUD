export interface AuthorView {
    mangaAuthorId: number;
    name?: string;
    birthday?: string;
    alternateName?: string;
    authorImage?: string;

  }

  export interface Author {
    mangaAuthorId: number;
    name?: string;
    birthday?: string;
    alternateName?: string;
    authorImage?: string;
    boTruyens: [];
  }