// File to write test cases
// Create by: Andrzej Ciepiela
// Create on: 11/15/2023
// Last update: 11/15/2023


const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server.js'); 

describe('User Registration', () => {
    it('should register a user successfully', (done) => {
        request(app)
        .post('/register')
        .send({username: 'newuser', password: 'password123'})
        .end((err,res) => {
            expect(res.statusCode).to.equal(201);
            expect(res.body).to.have.property('message', 'User created');
            done();
        });
    });

    // Add more test cases for failure scenarios
});