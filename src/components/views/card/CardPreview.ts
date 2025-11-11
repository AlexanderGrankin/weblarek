import { ensureElement } from "../../../utils/utils";
import { Card, categoryKey } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export class CardPreview extends Card{
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected buttonElement: HTMLButtonElement;
    protected descriptionElement: HTMLElement;
    protected inBasket: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container)

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('preview:button-click', {id: this.productId}) 
        })
    }

    set category(value: string){
        this.categoryElement.textContent = value;
    
        for(const key in categoryMap){
            this.categoryElement.classList.toggle(
                categoryMap[key as categoryKey], key === value
            )
        }
    }

    set description(value:string) {
        this.descriptionElement.textContent = value;
    }

    set image(value: string){
        this.setImage(this.imageElement, value, this.title)
    }

    setInBasket(inBasket: boolean){
        this.inBasket = inBasket;
        if (this.buttonElement) {
            if (inBasket) {
                this.buttonElement.textContent = 'Удалить из корзины';
            } else {
                this.buttonElement.textContent = 'Купить';
            }
        }
    }

    render(product: IProduct, inBasket: boolean = false): HTMLElement {
        this.id = product.id;
        this.title = product.title;
        this.category = product.category;
        this.description = product.description || '';
        this.price = product.price;
        this.image = product.image;

        this.setInBasket(inBasket);

        if (product.price === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.buttonElement.disabled = false;
            this.setInBasket(inBasket); 
        }

        return this.container;
    }
}

