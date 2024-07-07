import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "John");
const address = new Address("Rua Pineia", 123, "06462-145", "Barueri");
customer.changeAddress(address);
const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit Test find customer user case", () => {

    it("should find a customer", async () => {

        const customerRepository = MockRepository();
        const useCase = new FindCustomerUseCase(customerRepository);

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

    it("should not find a customer", async () => {
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found")
        })
        const useCase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: "123",
        }

        expect(() => {
            return useCase.execute(input);
        }).rejects.toThrow("Customer not found");
    });

});