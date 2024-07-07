import { Sequelize } from "sequelize-typescript"
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test find customer user case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        
        await sequelize.addModels([CustomerModel])
        await sequelize.sync();
    })

    afterEach(async () =>{
        await sequelize.close();
    });

    
    it("should find a customer", async () => {

        const customerRepository = new CustomerRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

        const customer = new Customer("123", "John");
        const address = new Address("Rua Pineia", 123, "06462-145", "Barueri");
        customer.changeAddress(address);
        
        await customerRepository.create(customer)

        const input = {
            id: "123",
        }

        const expectedOutput = {
            id: "123",
            name: "John",
            address: {
                street: "Rua Pineia",
                city: "Barueri",
                number: 123,
                zip: "06462-145",
            }
        }

        const output = await useCase.execute(input);
        
        expect(output).toEqual(expectedOutput)

    })

});