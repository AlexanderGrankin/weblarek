import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, categoryKey } from "./Card";

export class CardCatalog extends Card {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container)
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container)

        this.container.addEventListener('click', () => {
            this.events.emit('card:select', {id: this.productId})
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

    set image(value: string){
        this.setImage(this.imageElement, value, this.title)
    }
}