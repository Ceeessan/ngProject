export interface Content {
    _id: string;
    filename: string;
    createdName: string;
    type:string;
    fileurl: string;
    timestamp?: Date;
    userId: string;
    duration: number;
    hasPlaylists?: boolean;
    playlists?: string[];
    actualFile?: File;
  }