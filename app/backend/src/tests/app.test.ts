import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { verify } from '../utils/jwt';

chai.use(chaiHttp);

const { expect } = chai;
describe('All tests', () => {
  describe('Test endpoint /login', () => {
    let chaiHttpResponse: Response;
  
    it('status = 200 and returns an object', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "secret_admin" })
      
      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
    });
  
    it('can not login without email', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ password: "secret_admin" })
      
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
          password: "secret_admin" })
      chaiHttpResponse2 = await chai.request(app)
        .get('/login/validate')
        .set('Authorization', 'anyToken')
      
      expect(chaiHttpResponse2).have.status(401);
    });

    it('try get with right token', async () => {
      chaiHttpResponse1 = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "secret_admin" })

      chaiHttpResponse2 = await chai.request(app)
        .get('/login/validate')
        .set('Authorization', chaiHttpResponse1.body.token)
      
      expect(chaiHttpResponse2).have.status(200);
    });
  })

  describe('Test endpoint /clubs', async () => {
    let chaiHttpResponse: Response;

    it('status = 200 and returns an array', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/clubs')
      
      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });
  });

  describe('Test endpoint /clubs/:id', async () => {
    let chaiHttpResponse: Response;

    it('check if it returns what was expected', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/clubs/1')
      
      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body.id).to.be.equal(1);
    });
  });

  describe('Test endpoint /matchs', async () => {
    let chaiHttpResponse: Response;
    let chaiHttpResponse1: Response;

    it('status = 200 and returns an array', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/matchs')
      
      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });

    it('checks if objects have the correct keys', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/matchs')

      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('id');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('homeTeam');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('homeTeamGoals');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('awayTeam');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('awayTeamGoals');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('inProgress');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('homeClub');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('awayClub');
    });

    it('check if returns just inProgress = true', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/matchs')
        .query({ inProgress: 'true' })

      let arr = chaiHttpResponse.body;

      expect(arr[0].inProgress).to.be.equal(true);
      expect(arr[arr.length-1].inProgress).to.be.equal(true);
    });

    it('check if returns just inProgress = false', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/matchs')
        .query({ inProgress: 'false' })

      let arr = chaiHttpResponse.body;

      expect(arr[0].inProgress).to.be.equal(false);
      expect(arr[arr.length-1].inProgress).to.be.equal(false);
    });

    it('checks if authorization token is valid', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "secret_admin" })

      chaiHttpResponse1 = await chai.request(app)
        .post('/matchs')
        .set('Authorization', chaiHttpResponse.body.token)

      const verifiedToken = verify(chaiHttpResponse.body.token);
      expect(verifiedToken).to.haveOwnProperty('role');
    });

    it('check if it is possible to save a game in the database', async () => {
      chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: "admin@admin.com",
        password: "secret_admin" })
      
      chaiHttpResponse1 = await chai.request(app)
        .post('/matchs')
        .send({
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2,
          "inProgress": true
        })
        .set('Authorization', chaiHttpResponse.body.token)

      expect(chaiHttpResponse1.body).to.haveOwnProperty('id');
      expect(chaiHttpResponse1.body).to.haveOwnProperty('homeTeam').equal(16);
      expect(chaiHttpResponse1.body).to.haveOwnProperty('homeTeamGoals').equal(2);
      expect(chaiHttpResponse1.body).to.haveOwnProperty('awayTeam').equal(8);
      expect(chaiHttpResponse1.body).to.haveOwnProperty('awayTeamGoals').equal(2);
      expect(chaiHttpResponse1.body).to.haveOwnProperty('inProgress').equal(true);
    });

    it('checks if authorization token is valid', async () => {
      chaiHttpResponse = await chai.request(app)
        .patch('/matchs/1/finish')

      expect(chaiHttpResponse).have.status(200)
      expect(chaiHttpResponse.body.inProgress).to.be.equal(false);
    });
  });

  describe('Test endpoint /leaderboard', async () => {
    let chaiHttpResponse: Response;
  
    it('status = 200 and returns an array', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard')

      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });

    it('checks if objects have the correct keys', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard')

      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('name');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalPoints');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalGames');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalVictories');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalDraws');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalLosses');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsFavor');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsOwn');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsBalance');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('efficiency');
    });

    it('checks if objects are in the correct position', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard')

      expect(chaiHttpResponse.body[1].name).to.deep.equal("Corinthians");
      expect(chaiHttpResponse.body[7].name).to.deep.equal("Ferroviária");
      expect(chaiHttpResponse.body[15].name).to.deep.equal("Napoli-SC");
    });
  });

  describe('Test endpoint /leaderboard/home', async () => {
    let chaiHttpResponse: Response;
  
    it('status = 200 and returns an array', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });

    it('checks if objects have the correct keys', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('name');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalPoints');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalGames');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalVictories');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalDraws');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalLosses');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsFavor');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsOwn');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsBalance');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('efficiency');
    });

    it('checks if objects are in the correct position', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/home')

      expect(chaiHttpResponse.body[1].name).to.deep.equal("Palmeiras");
      expect(chaiHttpResponse.body[7].name).to.deep.equal("Botafogo");
      expect(chaiHttpResponse.body[15].name).to.deep.equal("Bahia");
    });
  });

  describe('Test endpoint /leaderboard/away', async () => {
    let chaiHttpResponse: Response;
  
    it('status = 200 and returns an array', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/away')

      expect(chaiHttpResponse).have.status(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });

    it('checks if objects have the correct keys', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/away')

      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('name');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalPoints');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalGames');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalVictories');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalDraws');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('totalLosses');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsFavor');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsOwn');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('goalsBalance');
      expect(chaiHttpResponse.body[0]).to.haveOwnProperty('efficiency');
    });

    it('checks if objects are in the correct position', async () => {
      chaiHttpResponse = await chai.request(app)
        .get('/leaderboard/away')

      expect(chaiHttpResponse.body[1].name).to.deep.equal("Corinthians");
      expect(chaiHttpResponse.body[7].name).to.deep.equal("Grêmio");
      expect(chaiHttpResponse.body[15].name).to.deep.equal("Napoli-SC");
    });
  });
});
