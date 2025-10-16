import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { apiProducts } from './utils/data.ts';
import { Cart } from './components/models/Cart.ts';
import { Buyer } from './components/models/Buyer.ts';
import { Communication } from './components/models/Communication.ts';
import { API_URL } from './utils/constants.ts';
import { IOrder } from './types/index.ts';

//Проверки функций каталога товаров
const productsModel = new ProductCatalog()

productsModel.setProducts(apiProducts.items) //Проверка функции setProducts

console.log(`Массив товаров из каталога: `, productsModel.getProducts()) //Проверка функции getProducts

const productById = productsModel.getProductById(apiProducts.items[0].id) 
console.log(`Товар по первому id: `, productById) //Проверка функции getProductById 

productsModel.setSelectedProduct(apiProducts.items[2]) //Проверка функции setSelectedProduct

console.log(`Третий продукт:`, productsModel.getSelectedProduct()) //Проверка функции getSelectedProduct

//Проверки функций корзины
const cart = new Cart()

cart.addProduct(apiProducts.items[0])
cart.addProduct(apiProducts.items[1])
cart.addProduct(apiProducts.items[2]) // Проверка функции addProduct

console.log(`Товары в корзине: `, cart.getProducts()) // Проверка функции getProducts

cart.removeProduct(apiProducts.items[1])
console.log(`Товары в корзине: `, cart.getProducts()) // Проверка функции removeProduct

cart.clear()
console.log(`Товары в корзине: `, cart.getProducts()) // Проверка функции clear

cart.addProduct(apiProducts.items[0])
cart.addProduct(apiProducts.items[1])

console.log(`Стоимость корзины:`, cart.getTotalPrice()) //Проверка функции getTotalPrice

console.log(`Количество товаров в корзине:`, cart.getProductsCount()) // Проверка функции getProductsCount

console.log(`Наличие товара в корзине:`, cart.hasProduct('854cef69-976d-4c2a-a18c-2aa45046c390')) // Проверка функции hasProduct

//Проверки функций для пользователя

const buyer = new Buyer()

buyer.setData({ payment: "card", address: "Ул.Ленина, д.1", phone: "+790812345678", email: "sacha.grankin.04@mail.ru"})
console.log(`Данные покупателя:`,buyer.getData()) // Проверка функций setData и getData

console.log(`Результат валидации:`, buyer.validate()) // Проверка функции validate

buyer.clear() 
console.log(`Данные покупателя очищены:`,buyer.getData()) // Проверка функции clear

// Проверка работы API

const communication = new Communication(API_URL)

const myOrder: IOrder = {
  payment: "cash",
  email: "sacha.grankin.04@mail.ru",
  phone: "+790812345678",
  address: "Ул.Ленина, д.1",
  total: 2200,
  items: ["854cef69-976d-4c2a-a18c-2aa45046c390", "c101ab44-ed99-4a54-990d-47aa2bb4e7d9"] 
};

try{
    const products = await communication.getData()
    console.log(`Тестовый каталог товаров:`, products)
}
catch(err){
    console.error("Ошибка при получении товаров", err)
}

try{
    const result = await communication.postData(myOrder)
    console.log(`Данные отправлены:`, result)
}
catch(err){
    console.error("Не удалось создать заказ: ", err)
}

