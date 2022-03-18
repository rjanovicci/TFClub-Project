import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;
describe('All tests', () => {
  describe('Test endpoint /login', () => {
    let chaiHttpResponse: Response;
  
    it('status = 200 and returns an object', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW" })
      
      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
    });
  
    it('can not login without email', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ password: "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW" })
      
      expect(chaiHttpResponse).have.status(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });
    });
  
    it('can not login without password', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com" })
      
      expect(chaiHttpResponse).have.status(401);
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });
    });
  });

  describe('Test endpoint /login/validate', async () => {
    let chaiHttpResponse1: Response;
    let chaiHttpResponse2: Response;

    it('try get with no token', async () => {
      chaiHttpResponse2 = await chai.request(app)
        .get('/login/validate')
        .set('Authorization', '')
      
      expect(chaiHttpResponse2).have.status(401);
    });

    it('try get with wrong token', async () => {
      chaiHttpResponse1 = await chai.request(app)
          .post('/login')
          .send({ email: "admin@admin.com",
          password: "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW" })
      chaiHttpResponse2 = await chai.request(app)
        .get('/login/validate')
        .set('Authorization', 'anyToken')
      
      expect(chaiHttpResponse2).have.status(401);
    });

    it('try get with right token', async () => {
      chaiHttpResponse1 = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW" })

      chaiHttpResponse2 = await chai.request(app)
        .get('/login/validate')
        .set('Authorization', chaiHttpResponse1.body.token)
      
      expect(chaiHttpResponse2).have.status(200);
    });
  })
});
