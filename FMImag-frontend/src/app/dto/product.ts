import {ImageResponse} from "../services/product.service";
import {SafeHtml} from "@angular/platform-browser";

export interface Product{
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  details: string;
  stock: number;
  images: ImageResponse[];
  imagesSafe: SafeHtml[];
  specifications: string;
  specificationsDict: Map<string, string>;
}
