import {ImageResponse} from "../services/product.service";
import {SafeHtml} from "@angular/platform-browser";
import {Category} from "./category";

export interface Product{
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  description: string;
  stock: number;
  images: ImageResponse[];
  imagesSafe: SafeHtml[];
  specifications: string;
  specificationsDict: Map<string, string> | null;
  categoryId: number | null;
}
