process.env.NODE_ENV = 'test'
process.env.SKIP_LAUNCH = "true"
process.env.authToken = "123456"
process.env.browserLimit = -1

const { app } = require('../src/index')
const request = require("supertest")

test('Request Authorisation Control Test', async () => {
    return request(app)
        .post("/cf-clearance-scraper")
        .send({
            url: 'https://nopecha.com/demo/cloudflare',
            mode: "source"
        })
        .expect(401)
}, 10000)

test('Browser Context Limit Control Test', async () => {
    return request(app)
        .post("/cf-clearance-scraper")
        .send({
            url: 'https://nopecha.com/demo/cloudflare',
            mode: "source",
            authToken: "123456"
        })
        .expect(429)
}, 10000)