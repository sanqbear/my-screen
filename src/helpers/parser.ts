import * as cheerio from 'cheerio';

export interface Artwork {
  id: string;
  title: string;
  thumbnailUrl: string;
  author: string;
  likes: number;
  views: number;
}

export function parseHomeArtworks(html: string): Artwork[] {
  const $ = cheerio.load(html);
  const artworks: Artwork[] = [];

  // TODO: 실제 HTML 구조에 맞게 선택자를 수정해야 합니다
  $('.artwork-item').each((_, element) => {
    const $element = $(element);
    
    const artwork: Artwork = {
      id: $element.attr('data-id') || '',
      title: $element.find('.title').text().trim(),
      thumbnailUrl: $element.find('img').attr('src') || '',
      author: $element.find('.author').text().trim(),
      likes: parseInt($element.find('.likes').text().trim(), 10) || 0,
      views: parseInt($element.find('.views').text().trim(), 10) || 0,
    };

    artworks.push(artwork);
  });

  return artworks;
}
