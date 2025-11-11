import { IBuyer, TPayment } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer{
  payment: TPayment | null = null;
  address: string = "";
  phone: string = ""
  email: string = ""

  constructor(private events: IEvents) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>) :void {
    if (data.payment !== undefined) 
      this.payment = data.payment;

    if (data.address !== undefined) 
      this.address = data.address;

    if (data.phone !== undefined) 
      this.phone = data.phone;

    if (data.email !== undefined) 
      this.email = data.email;

    this.events.emit('Buyer:changed', this.getData());
  }

  getData(): { payment: TPayment | null; email: string | null; phone: string | null; address: string | null } {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    }
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit('Buyer:changed', this.getData());
  }

  validate(): { isValid: boolean; errors: Record<string, string> }{
    const errors: Record<string, string> = {};

    if (!this.payment) {
      errors.payment = 'Необходимо указать тип оплаты';
    }

    if (!this.email) {
      errors.email = 'Необходимо указать адрес эл.почты';
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать номер телефона';
    }

    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}