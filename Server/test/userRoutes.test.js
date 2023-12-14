// userRoutes.test.js

const { expect } = require('chai');
const request = require('supertest');
const app = require('../index'); // Adjust the path to your app file

let loginRes; // Define loginRes outside the test cases to make it accessible in all test cases

describe('User Routes', function () {
  // Before any tests run, set up the environment (HOOKS)
  before(async function () {
    this.timeout(5000); // Set the timeout to 5000ms
    // Additional setup if needed
  });
  

  // After all tests have run, perform cleanup (HOOKS)
  after(async function () {
    // Additional cleanup if needed
  });

  // Before each test, reset the test data (HOOKS)
  beforeEach(async function () {
    // Additional setup if needed
  });

  // After each test, perform any needed cleanup (HOOKS)
  afterEach(async function () {
    // Additional cleanup if needed
  });

  // Actual test cases
  it('should register a new user', async function () {
    const userData = {
      fname: 'John',
      lname: 'Doe',
      uname: 'johndoe',
      pw: '123',
    };
  
    const res = await request(app)
      .post('/user/register') // Adjust the route path
      .send(userData);
  
    expect(res.status).to.equal(200);
    // Additional assertions...
  
    // Clean up
  });
  
  it('should log in a user', async function () {
    const userData = {
      uname: 'johndoe',
      pw: '123', // Use a correct password for an existing user
    };
  
    const res = await request(app)
      .post('/user/login') // Adjust the route path
      .send(userData);
  
    expect(res.status).to.equal(200);
    // Additional assertions...
  
    // Clean up
  });
  

  it('should log in a user and get private user data with a valid token', async function () {
    const userData = {
      uname: 'johndoe',
      pw: '123', // Use a correct password for an existing user
    };
  
    // Log in the user and get the token from the response
    const loginRes = await request(app)
      .post('/user/login') // Adjust the route path
      .send(userData);
  
    // Ensure you get a 200 status for successful login
    expect(loginRes.status).to.equal(200);
  
    // Extract the token from the login response
    const validToken = loginRes.body.jwtToken;
  
    // Use the token to get private user data
    const privateDataRes = await request(app)
      .get('/user/private') // Adjust the route path
      .set('Authorization', `Bearer ${validToken}`);
  
    // Ensure you get a 200 status for successful private data retrieval
    expect(privateDataRes.status).to.equal(200);
  
    // Additional assertions...
    // Check if the response body contains the expected private data
  
    // Clean up
  });
  
  it('should log in a user and update user profile', async function () {
    const userData = {
      uname: 'johndoe',
      pw: '123', // Use a correct password for an existing user
    };
  
    // Log in the user and get the token from the response
    loginRes = await request(app)
      .post('/user/login') // Adjust the route path
      .send(userData);
  
    // Ensure you get a 200 status for successful login
    expect(loginRes.status).to.equal(200);
  
    // Extract the token from the login response
    const validToken = loginRes.body.jwtToken;
  
    const updatedData = {
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      avatar: 'new-avatar.png',
      bio: 'New bio',
    };
  
    // Use the token to update user profile
    const updateProfileRes = await request(app)
      .put('/user/profile') // Adjust the route path
      .set('Authorization', `Bearer ${validToken}`)
      .send(updatedData);
  
    // Ensure you get a 200 status for successful profile update
    expect(updateProfileRes.status).to.equal(200);
  
    // Additional assertions...
    // Check if the response body contains the expected success message or updated profile data
  
    // Clean up
  });
  
  it('should update user profile', async function () {

    // Assuming you have a valid token for authentication
    const token = loginRes.body.jwtToken;
  
    const updatedData = {
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      avatar: 'new-avatar.png',
      bio: 'New bio',
    };
  
    const res = await request(app)
      .put('/user/profile') // Adjust the route path
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
  
    expect(res.status).to.equal(200);
    // Additional assertions...
  
    // Clean up
  });

  it('should log in a user with incorrect password', async function () {
    const userData = {
      uname: 'johndoe',
      pw: 'incorrect_password', // Use an incorrect password for an existing user
    };
  
    const res = await request(app)
      .post('/user/login') // Adjust the route path
      .send(userData);
  
    expect(res.status).to.equal(401);
    // Additional assertions for the response body...
  
    // Clean up
  });
  
  it('should log in a non-existing user', async function () {
    const userData = {
      uname: 'non_existing_user',
      pw: 'password', // Use any password
    };
  
    const res = await request(app)
      .post('/user/login') // Adjust the route path
      .send(userData);
  
    expect(res.status).to.equal(401);
    // Additional assertions for the response body...
  
    // Clean up
  });
  
  it('should get private user data with an invalid token', async function () {
    const invalidToken = 'invalid_token';
  
    const res = await request(app)
      .get('/user/private') // Adjust the route path
      .set('Authorization', `Bearer ${invalidToken}`);
  
    expect(res.status).to.equal(403);
    // Additional assertions for the response body...
  
    // Clean up
  });
  
  it('should update user profile with an invalid token', async function () {
    const invalidToken = 'invalid_token';
    const updatedData = {
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      avatar: 'new-avatar.png',
      bio: 'New bio',
    };
  
    const res = await request(app)
      .put('/user/profile') // Adjust the route path
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(updatedData);
  
    expect(res.status).to.equal(403);
    // Additional assertions for the response body...
  
    // Clean up
  });
  
  it('should update profile for a non-existing user', async function () {
    const invalidToken = 'invalid_token';
    const updatedData = {
      firstName: 'NewJohn',
      lastName: 'NewDoe',
      avatar: 'new-avatar.png',
      bio: 'New bio',
    };
  
    const res = await request(app)
      .put('/user/profile') // Adjust the route path
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(updatedData);
  
    expect(res.status).to.equal(403);
    // Additional assertions for the response body...
  
    // Clean up
  });

  it('should delete a user', async function () {
  // Log in the user and get the token from the response
  const userData = {
    uname: 'johndoe',
    pw: '123', // Use a correct password for an existing user
  };

  const loginRes = await request(app)
    .post('/user/login')
    .send(userData);

  // Ensure you get a 200 status for successful login
  expect(loginRes.status).to.equal(200);

  // Extract the token from the login response
  const validToken = loginRes.body.jwtToken;

  // Provide the correct password for deleting the user
  const deleteRes = await request(app)
    .delete(`/user/delete/johndoe`) // Adjust the route path
    .set('Authorization', `Bearer ${validToken}`)
    .send({ password: '123' }); // Provide the correct password here

  // Ensure you get a 200 status for successful user deletion
  expect(deleteRes.status).to.equal(200);
  
    // Additional assertions...
    // Check if the response body contains the expected success message or user deletion confirmation
  
    // Clean up if needed
  });
});
