import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketView {
    items: HTMLElement[];  
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
	    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
	    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.disabled = true

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        this.setBasket(items.length)
    }

    set total(price: number) {
        this.priceElement.textContent = `${price} синапсов`;
    }

    setBasket(count: number) {
        this.buttonElement.disabled = count === 0;
    }

    // render(data?: IBasketView): HTMLElement {
    //     if (data) {
    //         this.items = data.items;
    //         this.total = data.total;
    //     }
    //     return this.container;
    // }
}