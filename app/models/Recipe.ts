export interface Recipe {
  isFavorite: any;
  id: string;
  title: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  time?: string;
}