// export enum CATEGORY {
//   'computer scientist',
// }

// export interface Pioneers {
//   id: number;
//   name: string;
//   summary: string;
//   image: string;
//   field: string;
//   category: CATEGORY;
//   wikipedia_link: string;
// }

export interface Pioneer {
  id: number;
  name: string;
  imageFile: string;
  wikipediaLink: string;
}

export interface WikipediaInfo {
  id: number;
  name: string;
  description: string;
  image_url: string;
  fieldOfWork: string[];
  notableWorks: string[];
  wikipedia_link: string;
}
