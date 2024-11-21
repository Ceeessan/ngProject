export interface Content {
    _id: string;
    filename: string;
    type:string;
    fileurl: string;
    timestamp?: Date;
    userId: string;
    hasPlaylists?: boolean;
    playlists?: string[];
    actualFile?: File;
  }
