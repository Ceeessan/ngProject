export interface Playlists {
    _id: string,
    userId: string;
    name: string;
    contentArray: PlaylistItem[]; 
    timestamp: Date;
  }

export type PlaylistItem = {
  contentId: string;
  duration: number;
}