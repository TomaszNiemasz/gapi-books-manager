export interface IVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    publisher: string;
    publishDate: string;
    description: string;
    averageRating: number;
    ratingsCount: number;
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    }
  };
}

export interface IBookshelf {
  id: string;
  selfLink: string;
  title: string;
  description: string;
  access: string;
  updated: string;
  created: string;
  columeCount: number;
  volumesLastUpdated: string;
}
