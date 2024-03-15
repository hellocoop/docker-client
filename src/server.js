#!/usr/bin/env node

const fastify = require('fastify')
const { helloAuth } = require('@hellocoop/fastify')
const { version } = require('./package-version.json')

if (!process.env.HELLO_CLIENT_ID) {
    throw new Error('HELLO_CLIENT_ID is required')
}
if (!process.env.HELLO_COOKIE_SECRET) {
    throw new Error('HELLO_COOKIE_SECRET is required')
}

const app = fastify()

const port = process.env.PORT || 8000

app.register(helloAuth, {logConfig:true})

// return the user's auth info 
app.get("/", async (request, reply) => {
  const auth = await request.getAuth();
  return reply.send(auth);
});

app.get("/version", async (request, reply) => {
  return reply.send({version});
});

const startServer = async () => {
    try {
        const listenResult = await app.listen({port, host: '0.0.0.0'})
        console.log({listenResult})
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

startServer();