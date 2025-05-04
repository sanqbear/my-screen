import {parse} from 'node-html-parser';

export interface Artwork {
  id: number;
  title: string;
  thumbnailUrl: string | null | undefined;
  oid: number | null;
  author: string | null;
  date: string | null;
  tags: string[];
}

export interface HomeArtworks {
  recent: Artwork[];
  recommend: Artwork[];
  weekly: Artwork[];
}

export interface ArtworkPagedList {
  artworks: Artwork[];
  hasNext: boolean;
}

const normalizeText = (title: string) => {
  let normalized = title
    .trim()
    .replace(/^[+\d]+\s+/, '')
    .trim()
    .replace(/^\d+\s+/, '')
    .trim();

  // 끝부분의 공백과 숫자를 반복해서 제거
  let prevLength;
  do {
    prevLength = normalized.length;
    normalized = normalized.replace(/\s+\d+$/, '').trim();
  } while (normalized.length < prevLength);

  return normalized;
};

const normalizeTag = (text: string) => {
  // 앞부분의 공백과 줄바꿈을 제거하고 뒤의 태그 부분만 남기기
  const parts = text
    .split('\n')
    .map(part => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] || '';
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
        title: normalizeText(imgItem.querySelector('.in-subject')?.text || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
        oid: null,
        author: null,
        date: null,
        tags: [],
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
        title: normalizeText(imgItem.querySelector('.in-subject')?.text || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
        oid: null,
        author: null,
        date: null,
        tags: [],
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
        title: normalizeText(imgItem.text?.trim() || ''),
        thumbnailUrl: imgItem
          .querySelector('img')
          ?.getAttribute('src')
          ?.replace(/^https?:\/\/[^/]+/, host),
        oid: null,
        author: null,
        date: null,
        tags: [],
      };
      homeArtworks.weekly.push(artwork);
    });
  }

  console.log('Parsing result:', homeArtworks);
  return homeArtworks;
};

export const parseRecentArtworks = (
  html: string,
  host: string,
): ArtworkPagedList => {
  console.log('Starting HTML parsing');
  const root = parse(html);
  console.log('HTML parsing completed');

  const postRows = root.querySelectorAll('.post-row');
  console.log(`Found ${postRows.length} recent artworks`);

  const artworks: Artwork[] = [];
  const pgEnd = root.querySelector('.pg')?.querySelector('.pg_end');
  const hasNext = !!pgEnd;

  postRows.forEach(row => {
    const imgItem = row.querySelector('img');
    const imgUrl = imgItem
      ?.getAttribute('src')
      ?.replace(/^https?:\/\/[^/]+/, host);
    const id = parseInt(
      row
        .querySelector('.pull-left')
        ?.querySelector('a')
        ?.getAttribute('href')
        ?.split('comic/')[1] || '0',
      10,
    );
    const title =
      row.querySelector('.post-subject')?.querySelector('a')?.text || '';

    const oid = parseInt(
      row
        .querySelector('.pull-right')
        ?.querySelector('a')
        ?.getAttribute('href')
        ?.split('comic/')[1] || '0',
      10,
    );
    const date = row
      .querySelector('.pull-right')
      ?.querySelectorAll('p')[1]
      ?.querySelector('span')?.text;
    const at = row.querySelector('.post-text')?.text;
    const author = at ? at.substring(0, at.lastIndexOf(' ')) : '';
    const tags = at ? normalizeTag(at || '').split(',') : [];

    if (id) {
      const artwork: Artwork = {
        id,
        title: normalizeText(title),
        thumbnailUrl: imgUrl || null,
        oid: oid || null,
        author: author ? normalizeText(author).split('\n')[0]?.trim() : null,
        date: date || null,
        tags: tags || [],
      };

      artworks.push(artwork);
    }
  });

  console.log('Parsing result:', artworks);
  return {artworks, hasNext};
};
