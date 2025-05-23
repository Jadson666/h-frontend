import type { WsResponse } from './ws';

export interface ResponseDAO {
  id: string;
  source: string;
  headline: string;
  link: string;
  keywords: string[];
  timestamp: number;
  priority: string;
}

export const wsAdapter = (data: WsResponse): ResponseDAO => {
  const { id, source, headline, assets, link, keywords, timestamp, priority } = data;
  return {
    id,
    source,
    headline,
    link: link ?? '',
    keywords: [...assets, ...keywords],
    timestamp,
    priority
  };
};
