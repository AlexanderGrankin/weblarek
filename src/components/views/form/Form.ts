import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface IForm{
    valid: boolean;
    error: string | null
}

export class Form extends Component<IForm> {
    protected submitButtonElement: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents){
        super(container)
        this.submitButtonElement = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container); 

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButtonElement.disabled = !value;
    }

    set errors(value: string) {
        this.errorElement.textContent = value || "";
    }

}