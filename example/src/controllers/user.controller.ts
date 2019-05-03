// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


import {UserService} from "../services/user.service";
import {get, param, post, requestBody} from "@loopback/openapi-v3";
import {Customer, User} from "../models";
import {model, property} from "@loopback/repository";
import {service} from "loopback4-spring";

@model()
class UserAndCustomer {
    @property()
    user: User;
    @property()
    customer: Customer;
}

export class UserController {
    constructor(
        @service(UserService)
        private userService: UserService
    ) {
    }

    @post('/user', {
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        'x-ts-type': UserAndCustomer
                    }
                }
            },
            required: true,
        },
        responses: {
            '200': {
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': UserAndCustomer
                        }
                    }
                }
            }
        }
    })
    async createUserAndCustomer(
        @requestBody() userAndCustomer: UserAndCustomer,
        @param.query.boolean('throwError') throwError: boolean = false
    ) {
        const {user, customer} = userAndCustomer;
        return await this.userService.create(user, customer, throwError);
    }

    @get('/all')
    async all() {
        return this.userService.listUserAndCustomer();
    }
}
