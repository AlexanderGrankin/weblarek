import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { categoryMap } from "../../../utils/constants";

export type categoryKey = keyof typeof categoryMap

export interface ICard{
    price: number | null;
    title: string; 
    id: string;
    basketIndex?: number;
}

export class Card extends Component<ICard> {  

    protected productId?: string;
    protected priceElement: HTMLSpanElement;
    protected titleElement: HTMLHeadingElement; 

    constructor(protected container: HTMLElement) {
		super(container);

        this.titleElement = ensureElement<HTMLHeadingElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLSpanElement>('.card__price', this.container);
    }

    set price(value: number | null) {
        this.priceElement.textContent = (value ? `${value} синапсов` : 'Бесценно');
    }

    set title(value:string) {
        this.titleElement.textContent = value;
    }

    set id( value: string) {
        this.productId = value;
    }
}
