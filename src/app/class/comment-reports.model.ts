// binh-luan.model.ts
export interface BinhLuan {
    IdComment: string;
    IdUser: string;
    MangaId: string;
    ChapterId?: string;
    CommentData?: string;
    Likecomment?: number;
    Dislikecomment?: number;
    DateComment?: Date;
    // Không cần phải bao gồm tất cả các quan hệ và thuộc tính
  }
  
  // thongbao-user.model.ts
  export interface ThongbaoUser {
    Id: string;
    IdUser: string;
    seen: boolean;
    message: string;
    dateTime: Date;
    target: string;
  }
  
  // user.model.ts
  export interface User {
    Id: string;
    Name: string;
  }
  