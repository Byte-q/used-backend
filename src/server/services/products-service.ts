import { ProductsRepository } from "../repositories/product-repository";
import { Product } from "../../shared/schema";

export class ProductsService {
  private productsRepository: ProductsRepository;

  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async getAllProducts() {
    return this.productsRepository.listProducts();
  }

  async getProductById(id: string) {
    return this.productsRepository.getProductById(id);
  }

  async createProduct(data: any) {
    return this.productsRepository.createProduct(data);
  }

  async updateProduct(id: string, data: any) {
    return this.productsRepository.updateProduct(id, data);
  }

  async deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }
}
