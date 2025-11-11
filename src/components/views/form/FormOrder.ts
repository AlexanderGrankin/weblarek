import { TPayment } from "../../../types";
import { Form } from "./Form";
import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export class FormOrder extends Form{
    protected addressInputElement: HTMLInputElement;
    protected paymentButtonsList: HTMLButtonElement[]

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this.addressInputElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtonsList = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container); 
        
        this.paymentButtonsList.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.payment = payment;
                this.events.emit('order:change', { payment });
            });
        });

        this.addressInputElement.addEventListener('input', () => {
            this.events.emit('order:change', { address: this.addressInputElement.value });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentButtonsList.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }

    render(data: { payment: TPayment | null; address: string; valid: boolean; errors: string | null }): HTMLElement {
        this.payment = data.payment;
        this.address = data.address;
        this.valid = data.valid;
        this.errors = data.errors || '';
        return this.container;
    }
}