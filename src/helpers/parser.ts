import {parse} from 'node-html-parser';

export interface Artwork {
  id: number;
  title: string;
  thumbnailUrl: string | null | undefined;
}

export interface HomeArtworks {
  recent: Artwork[];
  recommend: Artwork[];
  weekly: Artwork[];
}

const normalizeTitle = (title: string) => {
  return title
    .trim()
    .replace(/^[+\d]+\s+/, '')
    .trim()
    .replace(/^\d+\s+/, '')
    .trim();
};

export const parseHomeArtworks = (html: string, host: string): HomeArtworks => {
  console.log('Starting HTML parsing');
  const root = parse(html);
  console.log('HTML parsing completed');

  const homeArtworks: HomeArtworks = {
    recent: [],
    recommend: [],
    weekly: [],
  };

  const galleries = root.querySelectorAll('.miso-post-gallery');
  // 최근 작품 파싱
  const recentSection = galleries[0];
  if (recentSection) {
    console.log('Found recent artworks section');
    const postRows = recentSection.querySelectorAll('.post-row');
    console.log(`Found ${postRows.length} recent artworks`);

    postRows.forEach(row => {
      const link = row.querySelector('a');
      const imgItem = row.querySelector('.img-item');
      if (!link || !imgItem) {
        return;
      }

      const artwork: Artwork = {
        id: parseInt(link.getAttribute('href')?.split('comic/')[1] || '0', 10),
        title: normalizeTitle(imgItem.querySelector('.in-subject')?.text || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
      };
      homeArtworks.recent.push(artwork);
    });
  }

  // 추천 작품 파싱
  const recommendSection = galleries[galleries.length - 1];
  if (recommendSection) {
    console.log('Found recommended artworks section');
    const postRows = recommendSection.querySelectorAll('.post-row');
    console.log(`Found ${postRows.length} recommended artworks`);

    postRows.forEach(row => {
      const link = row.querySelector('a');
      const imgItem = row.querySelector('.img-item');
      if (!link || !imgItem) {
        return;
      }

      const artwork: Artwork = {
        id: parseInt(link.getAttribute('href')?.split('comic/')[1] || '0', 10),
        title: normalizeTitle(imgItem.querySelector('.in-subject')?.text || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
      };
      homeArtworks.recommend.push(artwork);
    });
  }

  // 주간 작품 파싱
  const lists = root.querySelectorAll('.miso-post-list');
  const weeklySection = lists[lists.length - 1];
  if (weeklySection) {
    console.log('Found weekly artworks section');
    const postRows = weeklySection.querySelectorAll('.post-row');
    console.log(`Found ${postRows.length} weekly artworks`);

    postRows.forEach(row => {
      const imgItem = row.querySelector('a');
      if (!imgItem) {
        return;
      }

      const artwork: Artwork = {
        id: parseInt(
          imgItem.getAttribute('href')?.split('comic/')[1] || '0',
          10,
        ),
        title: normalizeTitle(imgItem.text?.trim() || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
      };
      homeArtworks.weekly.push(artwork);
    });
  }

  console.log('Parsing result:', homeArtworks);
  return homeArtworks;
};
