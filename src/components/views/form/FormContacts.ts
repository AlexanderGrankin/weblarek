import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class FormContacts extends Form{
    protected emailInputElement: HTMLInputElement;
	protected phoneInputElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

		this.emailInputElement = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
		this.phoneInputElement = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInputElement.addEventListener('input', () => {
            this.events.emit('contacts:change', { email: this.emailInputElement.value });
        });

        this.phoneInputElement.addEventListener('input', () => {
            this.events.emit('contacts:change', { phone: this.phoneInputElement.value });
        });
    }

    set email(value: string) {
        this.emailInputElement.value = value;
	}

	set phone(value: string) {
        this.phoneInputElement.value = value;
	}

    render(data: { email: string; phone: string; valid: boolean; errors: string | null }): HTMLElement {
        this.email = data.email;
        this.phone = data.phone;
        this.valid = data.valid;
        this.errors = data.errors || '';
        return this.container;
    }
}