export type Episode = {
  date: string;
  episode_no: string;
  guests: string[];
  notes: string;
  title: string;
  top_5_comparison_year: string;
  url: string;
  _id: string;
};

export type SearchResponse = {
  limit: number;
  page: number;
  results: Episode[];
};
