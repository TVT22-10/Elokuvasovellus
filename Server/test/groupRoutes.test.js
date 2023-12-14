const { expect } = require('chai');
const request = require('supertest');
const app = require('../index'); // Adjust the path to your app file

let token; // Token for authentication
let existingGroupId; // Variable to store the existing group ID

describe('Group Routes', function () {
    before(async function () {
        // Increase the timeout for the "before all" hook
        this.timeout(10000);

        // Register a new user for the test
        const registrationData = {
            uname: 'testuser',
            pw: 'testpassword',
        };

        try {
            // Register the user
            const registrationRes = await request(app)
                .post('/user/register') // Adjust the route path
                .send(registrationData);

            // Check if the registration was successful

            // Log in the registered user and get the token for authentication
            const loginData = {
                uname: 'testuser',
                pw: 'testpassword',
            };

            const loginRes = await request(app)
                .post('/user/login') // Adjust the route path
                .send(loginData);

            // Check if the login was successful and the token is received
            if (!loginRes.body || !loginRes.body.jwtToken) {
                // Handle login failure
            }

            token = loginRes.body.jwtToken;

            // Log the token for debugging
        } catch (error) {
            // Handle registration or login errors
        }
    });

    it('should create a new group and get details', async function () {
        const groupData = {
            groupname: 'TestGroup',
            groupdescription: 'testgroup',
        };

        // Create a new group
        const createRes = await request(app)
            .post('/groups/create')
            .set('Authorization', `Bearer ${token}`)
            .send(groupData);

        // Check if the group creation was successful
        expect(createRes.status).to.equal(201);

        // Extract the group ID from the response based on the actual structure
        const newGroupId = createRes.body.group.group_id;

        // Check if newGroupId is a string
        expect(newGroupId.toString()).to.be.a('string', 'Group ID is not a string');

        // Store the new group ID for later use
        existingGroupId = newGroupId;

        // Fetch details of the newly created group
        const detailsRes = await request(app)
            .get(`/groups/${existingGroupId}/details`)
            .set('Authorization', `Bearer ${token}`);

        // Check if fetching group details was successful
        expect(detailsRes.status).to.equal(200);
        // Additional assertions for group details...
    });

    it('should delete the created group', async function () {
        // Delete the created group
        const deleteRes = await request(app)
            .delete(`/groups/${existingGroupId}`)
            .set('Authorization', `Bearer ${token}`);

        // Check if the group deletion was successful
        expect(deleteRes.status).to.equal(200);
        // Additional assertions for group deletion...
    });

    after(async function () {
        // Perform cleanup if needed
        // Delete the test user
        try {
            await request(app)
                .delete(`/groups/TestGroup`) // Adjust the route path
                .set('Authorization', `Bearer ${token}`);
        } catch (error) {
            console.error('Error deleting test group:', error);
        }
    });
});
