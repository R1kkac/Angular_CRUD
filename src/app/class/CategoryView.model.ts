export interface CategoryView {
    genreId: string; 
    genresIdName: string;
    info: string;
  }

export interface Category {
    genreId: number;
    genresIdName: string;
    info: string;
    mangas: any[]; // Sửa lại kiểu dữ liệu phù hợp nếu cần
  }