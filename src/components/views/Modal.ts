import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModal{
    closeButton: HTMLButtonElement;
    content: HTMLTemplateElement
}

export class Modal extends Component<IModal>{
    protected closeButtonElement: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container)

        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButtonElement.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    open(element: HTMLElement) { 
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';

        this.contentElement.replaceChildren(element); 
        this.events.emit("modal:open");
    }

    close() {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        if (this.contentElement) {
            this.contentElement.innerHTML = '';
        }
        this.events.emit("modal:close");
    }

    getCurrentContent(): string | null {
        const firstChild = this.contentElement.firstElementChild;
        if (firstChild && firstChild instanceof HTMLElement) {
            return firstChild.className;
        }
        return null;
    }

    isModalOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }

    setContent(content: HTMLElement) {
        if (this.contentElement) {
            this.contentElement.replaceChildren(content);
        }
    }
}