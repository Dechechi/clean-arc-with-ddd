import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress("John", new Address("street", 123, "Zip", "City"));

const input = {
    id: customer.id,
    name: "John Updated",
    address: {
        street: "Street Updated",
        number: 456,
        zip: "Zip Updated",
        city: "City Updated"
    },
};

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    };
};

describe("Unite test for customer update use case", () =>{
    it("Should update a customer", async () => {
        const customerRepository = MockRepository();
        const customerCreateUseCase = new UpdateCustomerUseCase(customerRepository);

        const output = await customerCreateUseCase.execute(input);

        expect(output).toEqual(input);
    })
})