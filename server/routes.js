/*
// Created by Academy on 20/10/16
*/
var HttpStatus = require('http-status');

var StudentController = require('./controllers/StudentController');
var CountryController = require('./controllers/master/CountryController');
var StateController = require('./controllers/master/StateController');
var CityController = require('./controllers/master/CityController');
var CollegeController = require('./controllers/CollegeController');
var HostelController = require('./controllers/HostelController');

module.exports = function (router) {

    router.all('/', function (req, res) {
        res.sendFile('index.html', { root: './public/' });
    });

    router.all('/isServerRunning', function (req, res) {
        res.status(200).json({ code: 200, data: "Server Running..." })
    });

    router.all('/getTime', function (req, res) {
        res.status(200).json({ code: 200, data: { date: new Date().toUTCString() } })
    });

    /*
        Add your routes here
     */

    // Student routes
    router.get('/students', function (req, res) {
        return StudentController.list(req, res);
    });

    router.get('/student/:id', function (req, res) {
        return StudentController.get(req, res);
    });

    router.get('/college/:id/students', function (req, res) {
        return StudentController.getByCollege(req, res);
    });
   
    router.post('/college/:id/student', function (req, res) {
        return StudentController.save(req, res);
    });

    router.put('/student/:id', function (req, res) {
        return StudentController.update(req, res);
    });

    router.put('/student/:id/activate', function (req, res) {
        return StudentController.activate(req, res);
    });

    router.put('/student/:id/deactivate', function (req, res) {
        return StudentController.deactivate(req, res);
    });

    // Country routes
    router.get('/countries', function (req, res) {
        return CountryController.list(req, res);
    });

    router.get('/activeCountries', function (req, res) {
        return CountryController.activeList(req, res);
    });

    router.post('/country', function (req, res) {
        return CountryController.save(req, res);
    });

    router.put('/country/:id', function (req, res) {
        return CountryController.update(req, res);
    });

    router.put('/country/:id/activate', function (req, res) {
        return CountryController.activate(req, res);
    });

    router.put('/country/:id/deactivate', function (req, res) {
        return CountryController.deactivate(req, res);
    });

    // State routes
    router.get('/country/:id/states', function (req, res) {
        return StateController.getByCountry(req, res);
    });

    router.get('/states', function (req, res) {
        return StateController.list(req, res);
    });

    router.get('/activeStates', function (req, res) {
        return StateController.activeList(req, res);
    });

    router.post('/state', function (req, res) {
        return StateController.save(req, res);
    });

    router.put('/state/:id', function (req, res) {
        return StateController.update(req, res);
    });

    router.put('/state/:id/activate', function (req, res) {
        return StateController.activate(req, res);
    });

    router.put('/state/:id/deactivate', function (req, res) {
        return StateController.deactivate(req, res);
    });

    // College routes
    router.get('/college/:id/countries', function (req, res) {
        return CollegeController.getByCountry(req, res);
    });

    router.get('/college/:id', function (req, res) {
        return CollegeController.get(req, res);
    });

    router.get('/colleges', function (req, res) {
        return CollegeController.list(req, res);
    });

    router.get('/activeColleges', function (req, res) {
        return CollegeController.activeList(req, res);
    });

    router.post('/college', function (req, res) {
        return CollegeController.save(req, res);
    });

    router.put('/college/:id', function (req, res) {
        return CollegeController.update(req, res);
    });

    router.put('/college/:id/activate', function (req, res) {
        return CollegeController.activate(req, res);
    });

    router.put('/college/:id/deactivate', function (req, res) {
        return CollegeController.deactivate(req, res);
    });

    // Hostel routes
    router.get('/college/:id/hostels', function (req, res) {
        return HostelController.getByCollege(req, res);
    });

    router.get('/college/:id/activeHostels', function (req, res) {
        return HostelController.activeListByCollege(req, res);
    });

    router.get('/hostels', function (req, res) {
        return HostelController.list(req, res);
    });

    router.get('/activeHostels', function (req, res) {
        return HostelController.activeList(req, res);
    });

    router.post('/hostel', function (req, res) {
        return HostelController.save(req, res);
    });

    router.put('/hostel/:id', function (req, res) {
        return HostelController.update(req, res);
    });

    router.put('/hostel/:id/activate', function (req, res) {
        return HostelController.activate(req, res);
    });

    router.put('/hostel/:id/deactivate', function (req, res) {
        return HostelController.deactivate(req, res);
    });

    router.get('/hostel/:id', function (req, res) {
        return HostelController.get(req, res);
    });

    // City routes
    router.get('/state/:id/cities', function (req, res) {
        return CityController.getByState(req, res);
    });

    router.get('/cities', function (req, res) {
        return CityController.list(req, res);
    });

    router.get('/activeCities', function (req, res) {
        return CityController.activeList(req, res);
    });

    router.post('/city', function (req, res) {
        return CityController.save(req, res);
    });

    router.put('/city/:id', function (req, res) {
        return CityController.update(req, res);
    });

    router.put('/city/:id/activate', function (req, res) {
        return CityController.activate(req, res);
    });

    router.put('/city/:id/deactivate', function (req, res) {
        return CityController.deactivate(req, res);
    });

};