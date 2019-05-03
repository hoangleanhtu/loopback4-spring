import {Entity, model, property} from '@loopback/repository';

@model()
export class Customer extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @property({
        type: 'string',
        required: true,
    })
    firstName: string;

    @property({
        type: 'string',
        required: true,
    })
    lastName: string;

    constructor(data?: Partial<Customer>) {
        super(data);
    }
}
