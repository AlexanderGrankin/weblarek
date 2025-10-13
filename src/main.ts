import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { apiProducts } from './utils/data.ts';
import { Cart } from './components/models/Cart.ts';

//Проверки функций каталога товаров
const productsModel = new ProductCatalog()

productsModel.setProducts(apiProducts.items) //Проверка функции setProducts

console.log(`Массив товаров из каталога: `, productsModel.getProducts()) //Проверка функции getProducts

const productById = productsModel.getProductById(apiProducts.items[0].id) 
console.log(`Товар по первому id: `, productById) //Проверка функции getProductById 

productsModel.setSelectedProduct(apiProducts.items[2]) //Проверка функции setSelectedProduct

console.log(`Третий продукт:`, productsModel.getSelectedProduct()) //Проверка функции getSelectedProduct

//Проверки функций корзины
const cartModel = new Cart()

