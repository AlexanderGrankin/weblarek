# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
В приложении используются две сущности:
- товар
- покупатель

#### Интерфейс товара
```
interface IProduct {
  id: string; //номер товара
  description: string; //описание товара
  image: string; //изображение товара
  title: string; //название товара
  category: string; //категория товара
  price: number | null; //цена (может быть null, если товар бесплатный)
}
```

#### Интерфейс покупателя
```
interface IBuyer {
  payment: TPayment; //тип оплаты
  email: string; //e-mail покупателя
  phone: string; //телефон покупателя
  address: string; //адрес покупателя
}
```

### Модели данных
#### Каталог товаров
Класс ProductCatalog предназначен для хранения каталога товаров

Поля класса:
- `products: IProduct[]` для хранениея массива всех товаров
- `selectedProduct: IProduct | null` для хранения товара для отображения

Методы:
- `setProducts(products: IProduct[]): void` для сохранения массива товаров
- `getProducts(): IProduct[]` для получения массивов товаров из модели
- `getProductById(id: string): IProduct | null` для получения товара по id
- `setSelectedProduct(product: IProduct): void` для сохранения товара
- `getSelectedProduct(): IProduct | null` для получения товара для подробного отображения

#### Корзина
Класс Cart предназначен для хранения массива товаров, выбранных покупателем для покупки

Класс содержит одно поле:
- `products: IProduct[]` для хранения товаров в корзине у покупателя

Методы:

- `getProducts(): IProduct[]` для получения товаров в корзине
- `addProduct(product: IProduct): void` для добавления товара в корзину
- `removeProduct(product: IProduct): void` для удаления товара из корзины
- `clear(): void` для полной очистки корзины
- `getTotalPrice(): number` для получения стоимости товаров, находящихся в корзине
- `getProductsCount(): number` для получения количества товаров в корзине
- `hasProduct(productId: string): boolean` для проверки наличия товара в корзине

#### Покупатель
Класс Buyer предназначен для хранения данных, которые покупатель вводит в форму оплаты

Поля класса:
- `payment: TPayment | null`
- `address: string`
- `phone: string`
- `email: string`

Методы:
- `setData(data: Partial<IBuyer>) :void` для сохранения данных в модели
- `getData(): { payment: TPayment | null; email: string | null; phone: string | null; address: string | null }` для получения всех данных покупателя
- `clear(): void` для очистки данных покупателя
- `validate(): { isValid: boolean; errors: Record<string, string> }` для валидации поля 

### Слой коммуникации
Класс Communication выполняет запрос на сервер и получает объект с товарами

Методы:
- `getData(): Promise<ICatalogResult>` - выполняет запрос на сервер и возвращает массив товаров
- `postData(order: IOrder): Promise<IOrderResult>` - получает результат заказа (номера товаров, общая сумма заказа)

Интерфейсы:

- для каталога, который получаем с сервера:
```
interface ICatalogResult {
  total: number;    
  items: IProduct[];  
}
```

- для заказа, в котором содержатся данные, введенные пользователем:
```
interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];   
}
```

- для результата заказа, который возвращает сервер:
```
interface IOrderResult {
  id: string;
  total: number, 
}
```

### Слой представления 
В этом слое описываются классы, которые взаимодействуют с разметкой. 

#### Карточка товара
Класс Card - это родительский класс для карточек. Класс содержит поля:
* `protected productId?: string` - id товара
* `protected priceElement: HTMLSpanElement` - элемент для отображения цены
* `protected titleElement: HTMLHeadingElement ` - элемент для отображения названия товара

Методы:
* `set price(value: number | null)` - сеттер для цены
* `set title(value:string)` - сеттер для названия
* `set id( value: string)` - сеттер для id

#### Элемент товара в корзине
Класс CardBasket отвечает за отображение данных товара в корзине. Класс содержит поля:
* `protected productIndex: HTMLElement`
* `protected deleteButtonElement: HTMLButtonElement`

Методы:
* `setIndex(value: number)` - сеттер для номера товара
* `render(data: ICard)` - для разметки

#### Карточка товара в каталоге
Класс CardCatalog отвечает за отображение карточки в каталоге. Класс содержит поля:
* `protected imageElement: HTMLImageElement` - для изображения товара
* `protected categoryElement: HTMLElement` - для категории

Методы:
* `set category(value: string)` - сеттер для категории
* `set image(value: string)` - сеттер для изображения

#### Превью товара
Класс CardPreview отвечает за превью карточки после нажатия на карточку в каталоге. Класс содержит поля:
* `protected categoryElement: HTMLElement` - для категории
* `protected imageElement: HTMLImageElement` - для изображения
* `protected buttonElement: HTMLButtonElement` - для кнопки "Купить" / "удалить из корзины"
* `protected descriptionElement: HTMLElement` - для описания
* `protected inBasket: boolean = false` - для отображения состояния товара (есть ли он в корзине, или нет)

Методы:
* `set category(value: string)` - сеттер для категории 
* `set description(value:string)` - сеттер для описания
* `set image(value: string)` - сеттер для изображения
* `setInBasket(inBasket: boolean)` - для проверки товара в корзине
* `render(product: IProduct, inBasket: boolean = false): HTMLElement` - для разметки

#### Шапка
Класс Header отвечает за отображение кнопки корзины на верхней части страницы. Класс содержит поля:
* `protected counterElement: HTMLElement` - для счетчика товаров в корзине
* `protected basketButton: HTMLButtonElement` - для кнопки корзины

Методы:
* `set counter(value: number)` - сеттер для счетчика

#### Каталог
Класс Gallery отвечает за отображение каталога, состоящего из карточек товаров. 

Методы:
* `set catalog(items: HTMLElement[])` - сеттер для каталога

#### Модальное окно
Класс Modal - это родительский класс для отображения контента в модальном окне. Класс содержит поля:
* `protected closeButtonElement: HTMLButtonElement` - для кнопки закрытия окна
* `protected contentElement: HTMLElement` для контента окна

Методы:
* `open(element: HTMLElement)` - для открытия окна с определенным контентом
* `close()` - для закрытия окна
* `getCurrentContent(): string | null` - для получения названия контента
* `isModalOpen(): boolean` - для проверки, открыто окно или нет
* `setContent(content: HTMLElement)` - сеттер для контента

#### Корзина
Класс BasketView отвечает за отображение корзины в модальном окне. Класс содержит поля:
* `protected listElement: HTMLElement` - для товара в корзине
* `protected priceElement: HTMLElement` - для общей цены товаров в корзине
* `protected buttonElement: HTMLButtonElement` - для перехода к форме заказа

Методы:
* `set items(items: HTMLElement[])` - сеттер для товаров
* `set total(price: number)` - сеттер для общей цены товаров в корзине
* `setBasket(count: number)` - сеттер для номера товара в корзине
* `render(data: IBasketView): HTMLElement` - для разметки

#### Форма 
Класс Form - это родительский класс для форм. Класс содержит поля:
* `protected submitButtonElement: HTMLButtonElement` - для кнопки отправки данных формы
* `protected errorElement: HTMLElement` - для элемента, отображающего ошибки при вводе данных формы

Методы:
* `set valid(value: boolean)` - сеттер для установки состояния кнопки
* `set errors(value: string)` - сеттер для элемента, отображающего ошибки формы

#### Форма заказа
Класс FormOrder отвечает за отображение формы заказа. Класс содержит поля:
* `protected addressInputElement: HTMLInputElement` - для поля ввода адреса
* `protected paymentButtonsList: HTMLButtonElement[]` - для массива кнопок для выбора оплаты

Методы:
* `set payment(value: TPayment | null)` - сеттер для кнопок оплаты
* `set address(value: string)` - сеттер для адреса
* `render(data: { payment: TPayment | null; address: string; valid: boolean; errors: string | null }): HTMLElement` - для разметки

#### Форма контактов
Класс FormContacts отвечает за отображение формы контактов. Класс содержит поля:
* `protected emailInputElement: HTMLInputElement` - для поля ввода почты
* `protected phoneInputElement: HTMLInputElement` - для поля ввода телефона

Методы:
* `set email(value: string)` - сеттер для почты
* `set phone(value: string)` - сеттер для телефона
* `render(data: { email: string; phone: string; valid: boolean; errors: string | null }): HTMLElement` - для разметки

#### Окно успешного заказа
Класс Success отвечает за отображение окна после успешного заказа. Класс содержит поля:
* `protected titleElement: HTMLElement` - для заголовка окна
* `protected descriptionElement: HTMLElement` - для отображения стоимости заказа
* `protected buttonElement: HTMLButtonElement` - для закрытия окна

Методы:
* `set total(value: number)` - сеттер для стоимости заказа
* `render(data: { total: number }): HTMLElement` - для разметки

### Обработка событий
* `catalog:changed` - Загрузка каталога
* `card:select` - Пользователь выбирает карточку
* `catalog:product-selected` - Клик по карточке
* `preview:button-click` - Кнопка добавления/удаления товаров в превью карточки
* `basket:open` - Открытие корзины
* `basket:changed` - Изменение содержимого корзины
* `basket:remove` - Удаление Товара из корзины
* `basket:submit` - Кнопка "Оформить" в корзине
* `order:change` - Появление ошибки в форме заказа, если поля пустые
* `order:submit` - Кнопка "Далее" в форме заказа нажата, открывется форма контактов
* `contacts:change` - Появление ошибки в форме контактов, если поля пустые
* `contacts:submit` - Кнопка "Оплатить" в форме контактов нажата, данные отправляются на сервер, появляется окно подтверждения заказа
* `success:close` - Закрытие окна подтверждения заказа