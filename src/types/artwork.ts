export type Artwork = {
  id: number;
  title: string;
  image: string | null;
  oid: number | null;
  author: string | null;
  date: string | null;
  tags: string[];
};
