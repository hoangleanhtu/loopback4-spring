import {Options, repository} from "@loopback/repository";
import {CustomerRepository, UserRepository} from "../repositories";
import {Customer, User} from "../models";

import {IsolationLevel, transactional} from "../../../dist";

export class UserService {

    constructor(
        @repository(UserRepository)
        private userRepository: UserRepository,
        @repository(CustomerRepository)
        private customerRepository: CustomerRepository
    ) {
    }

    @transactional({isolationLevel: IsolationLevel.READ_COMMITTED})
    async create(
        user: User,
        customer: Customer,
        options?: Options // Options is populated by @transactional
    ): Promise<{user: User, customer: Customer}> {

        // Must pass options to propagation transaction
        await this.userRepository.create(user, options);
        await this.customerRepository.create(customer, options);

        return {user, customer};
    }
}
