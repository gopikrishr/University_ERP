var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);

it('should list all Countires on /countries GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/countries')
    .end(function(err, res){        
      console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');      
      done();
    });
});

it('should list all active Countires on /activeCountries GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/activeCountries')
    .end(function(err, res){
      console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');      
      done();
    });
});

it('should list all Cities By State on /state/:id/cities GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/state/598ad63360684453f4db67d1/cities')
    .end(function(err, res){        
      console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');      
      done();
    });
});

it('should list all Colleges by Country on /college/:id/countries GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/college/598ad516c9ffa12e9c07751c/countries')
    .end(function(err, res){
      console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');      
      done();
    });
});

it('should list all active Hostels by College on /countries GET', function(done) {
  chai.request('http://localhost:5000')
    .get('/college/598ad9e5d903c22410715570/activeHostels')
    .end(function(err, res){        
      console.log(res.body);  
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');      
      done();
    });
});
