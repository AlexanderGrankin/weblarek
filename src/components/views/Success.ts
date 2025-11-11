import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from '../base/Events';

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess>{
    protected titleElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.order-success__title', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }

    render(data: { total: number }): HTMLElement {
        this.total = data.total;
        return this.container;
    }
}