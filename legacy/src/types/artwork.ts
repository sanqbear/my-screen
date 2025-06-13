export type Artwork = {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  oid: number | null;
  tid: number | null;
  author: string | null;
  date: string | null;
  tags: string[];
};

export interface HomeArtworks {
  recent: Artwork[];
  recommend: Artwork[];
  weekly: Artwork[];
}

export interface ArtworkPagedList {
  artworks: Artwork[];
  hasNext: boolean;
}
