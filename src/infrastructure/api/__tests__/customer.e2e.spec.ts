import {app, sequelize} from '../express';
import request from 'supertest';

describe("E2E test for customer", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("Should create a customer", async () =>{
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street 1",
                    number: 123,
                    zip: "12345",
                    city: "City 1",
                },
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street 1");
        expect(response.body.address.number).toBe(123);
        expect(response.body.address.zip).toBe("12345");
        expect(response.body.address.city).toBe("City 1");
    });

    it("should not create a customer", async () =>{
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
            });

        expect(response.status).toBe(500);
    });

    it("should list all customers", async () =>{
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street 1",
                    number: 123,
                    zip: "12345",
                    city: "City 1",
                },
            });

        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customer")
            .send({
                name: "Jane",
                address: {
                    street: "Street 2",
                    number: 456,
                    zip: "56789",
                    city: "City 2",
                },
            });

        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customer").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);
        const customer1 = listResponse.body.customers[0];
        expect(customer1.name).toBe("John");
        expect(customer1.address.street).toBe("Street 1");
        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Jane");
        expect(customer2.address.street).toBe("Street 2");

        const listResponseXml = await request(app)
            .get("/customer")
            .set("Accept", "application/xml").send();

        expect(listResponseXml.status).toBe(200);
        expect(listResponseXml.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXml.text).toContain(`<name>John</name>`);
        expect(listResponseXml.text).toContain(`<street>Street 1</street>`);
        expect(listResponseXml.text).toContain(`<name>Jane</name>`);
        expect(listResponseXml.text).toContain(`<street>Street 2</street>`);
    });

});