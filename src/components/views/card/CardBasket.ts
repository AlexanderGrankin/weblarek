import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ICard } from "./Card";

export class CardBasket extends Card{
    protected productIndex: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container)

        this.productIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButtonElement.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this.productId })
        })
    }

    setIndex(value: number) {
        this.productIndex.textContent = String(value);
    }

    render(data: ICard) {
        if (data.id !== undefined) {
            this.productId = data.id;
        }
        return super.render(data);
    }
}