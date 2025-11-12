import { EventEmitter } from './components/base/Events';
import { Buyer } from './components/models/Buyer';
import { Basket } from './components/models/Basket.ts';
import { Communication } from './components/models/Communication';
import { ProductCatalog } from './components/models/ProductCatalog';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { CardCatalog } from './components/views/card/CardCatalog.ts';
import { cloneTemplate } from './utils/utils.ts';
import { ensureElement } from './utils/utils.ts';
import { Gallery } from './components/views/Gallery.ts';
import { CardPreview } from './components/views/card/CardPreview.ts';
import { Modal } from './components/views/Modal.ts';
import { CardBasket } from './components/views/card/CardBasket.ts';
import { BasketView } from './components/views/BasketView.ts';
import { Header } from './components/views/Header.ts';
import { FormOrder } from './components/views/form/FormOrder.ts';
import { FormContacts } from './components/views/form/FormContacts.ts';
import { TPayment } from './types/index.ts';
import { Success } from './components/views/Success.ts';

// ----- Модели -----

const events = new EventEmitter()
const api = new Communication(API_URL)

const productCatalog = new ProductCatalog(events)
const basket = new Basket(events)
const buyer = new Buyer(events)

// ----- Загрузка данных из API -----
api.getData()
.then((data) => {
    const updatedProducts = data.items.map(item => ({
        ...item,
        image: CDN_URL + item.image
    }))

    productCatalog.setProducts(updatedProducts)
})
.catch((err) => {
    console.error("Не удалось загрузить список товаров:", err)
})

// ----- Темплейты -----
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ----- Views -----
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events)
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const header = new Header(events, ensureElement<HTMLElement>('.header'))
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events)
const success = new Success(cloneTemplate(successTemplate), events)
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

// ----- События -----
// Загрузка каталога
events.on('catalog:changed', () => {
    const cards: HTMLElement[] = []

    for(const item of productCatalog.getProducts()){
        const cardCatalog = new CardCatalog(cloneTemplate(cardCatalogTemplate), events)
        const cardElement = cardCatalog.render(item)
        cards.push(cardElement)
    }

    gallery.catalog = cards
})

// Пользователь выбирает карточку
events.on('card:select', (data: { id: string }) => {
    const item = productCatalog.getProductById(data.id);
    if (item) {
        productCatalog.setSelectedProduct(item);
    }
})

// Клик по карточке
events.on('catalog:product-selected', () => {
    const selectedProduct = productCatalog.getSelectedProduct()

    if(selectedProduct){
        
        const inCart = basket.hasProduct(selectedProduct.id);
        const cardPreviewElement = cardPreview.render(selectedProduct, inCart);
        modal.open(cardPreviewElement);
    }
})

// Кнопка добавления/удаления товаров в превью карточки
events.on('preview:button-click', (data: { id: string }) => {
    const product = productCatalog.getProductById(data.id);
    if (!product) return;

    const isInBasket = basket.hasProduct(product.id);

    if (isInBasket) {
        basket.removeProduct(product);
    } else {
        basket.addProduct(product);
    }

    modal.close()
})

// Открытие корзины
events.on('basket:open', () => {
    // const basketProducts = basket.getProducts()
    // const basketItems: HTMLElement[] = []

    // basketProducts.map((product, index) => {
    //     const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    //     const cardElement = card.render({
    //         id: product.id,
    //         title: product.title,
    //         price: product.price,
    //         basketIndex: index + 1
    //     });
    //     basketItems.push(cardElement)
    // })

    // const basketElement = basketView.render({
    //     items: basketItems,
    //     total: basket.getTotalPrice(),
    // });

    modal.open(basketView.render());
})

// Изменение содержимого корзины
events.on('basket:changed', () => {
    header.counter = basket.getProductsCount();
    

        // const contentType = modal.getCurrentContent();
        // if (contentType && contentType.includes('basket')) {
            const basketProducts = basket.getProducts();

            const basketItems = basketProducts.map((product, index) => {
                const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
                return card.render({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    index: index + 1
                });
            });

            basketView.render({
                items: basketItems,
                total: basket.getTotalPrice(),
            });
            //modal.setContent(basketElement); 
        //}
    
})

// Удаление Товара из корзины
events.on('basket:remove', (data: { id: string }) => {
    const item = productCatalog.getProductById(data.id);
    if (item) {
        basket.removeProduct(item)
    }
})

// Кнопка "Оформить" в корзине
events.on('basket:submit', () => {
    const orderForm = formOrder.render({
        payment: buyer.payment,
        address: buyer.address,
        valid: false,
        errors: null
    });

    modal.open(orderForm);
})

// Появление ошибки в форме заказа, если поля пустые
events.on('order:change', (data: { payment: TPayment; address: string }) => {
    if (data.address !== undefined) {
        formOrder.address = data.address;
    }

    buyer.setData(data)
    const result = buyer.validate()

    const orderErrors = {
        payment: result.errors.payment,
        address: result.errors.address
    };

    const isOrderFormValid = !orderErrors.payment && !orderErrors.address;
    formOrder.valid = isOrderFormValid;
    formOrder.errors = [orderErrors.payment, orderErrors.address].filter(Boolean).join(', ');
});

// Кнопка "Далее" в форме заказа нажата, открывется форма контактов
events.on('order:submit', () => {
    const contactsForm = formContacts.render({
        email: buyer.email || '',
        phone: buyer.phone || '',
        valid: false, 
        errors: null
    })

    modal.open(contactsForm)
})

// Появление ошибки в форме контактов, если поля пустые
events.on('contacts:change', (data: { email: string; phone: string; }) => {
    if (data.email !== undefined) {
        formContacts.email = data.email;
    }
    if (data.phone !== undefined) {
        formContacts.phone = data.phone;
    }
    buyer.setData(data)

    const result = buyer.validate();

    const contactsErrors = {
        email: result.errors.email,
        phone: result.errors.phone
    };

    const isContactsFormValid = !contactsErrors.email && !contactsErrors.phone;
    formContacts.valid = isContactsFormValid;
    formContacts.errors = [contactsErrors.email, contactsErrors.phone].filter(Boolean).join(', ');
})

// Кнопка "Оплатить" в форме контактов нажата, данные отправляются на сервер, появляется окно подтверждения заказа
events.on('contacts:submit', async () => {
    const validation = buyer.validate();

    if (validation.isValid) {
        const orderData = {
            payment: buyer.payment!,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address,
            total: basket.getTotalPrice(),
            items: basket.getProducts().map(product => product.id) 
        };

        try {
            const result = await api.postData(orderData);

            if (result && result.id) {
                const successModal = success.render({
                    total: basket.getTotalPrice()
                });
                modal.open(successModal);
                console.log(result)

                basket.clear();
                buyer.clear();
                header.counter = 0; 
            } else {
                formContacts.errors = 'Ошибка при создании заказа';
            }

        }
        catch(err){
            formContacts.errors = "Ошибка при отправке заказа:", err
        }    
    } else {
        formContacts.errors = Object.values(validation.errors).join(', ');
    }
})

// Закрытие окна подтверждения заказа
events.on('success:close', () => {
    modal.close();

    basket.clear();
    buyer.clear();
});