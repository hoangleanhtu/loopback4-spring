import {repository} from "@loopback/repository";
import {CustomerRepository, UserRepository} from "../repositories";
import {Customer, User} from "../models";
import {transactional} from "../../../dist/transactional.decorator";

export class UserService {

    constructor(
        @repository(UserRepository)
        private userRepository: UserRepository,
        @repository(CustomerRepository)
        private customerRepository: CustomerRepository
    ) {
    }

    @transactional()
    async create(
        user: User,
        customer: Customer,
        throwError: boolean,
        options?: Object
    ): Promise<{user: User, customer: Customer}> {

        // Must pass options to propagate transaction
        await this.userRepository.create(user, options);
        await this.customerRepository.create(customer, options);

        if (throwError) {
            throw new Error('Error after create user & customer. Transaction is rollback.')
        }

        return {user, customer};
    }

    async listUserAndCustomer() {
        const users = await this.userRepository.find();
        const customers = await this.customerRepository.find();

        return {users, customers};
    }
}
