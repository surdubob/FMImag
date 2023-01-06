import {ImageResponse} from "../services/product.service";
import {SafeHtml} from "@angular/platform-browser";

export interface Product{
  id: number;
  name: string;
  price: number;
  details: string;
  stock: number;
  images: ImageResponse[];
  imagesSafe: SafeHtml[];
}
