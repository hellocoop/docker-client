#!/usr/bin/env node

const fastify = require('fastify')
const { helloAuth } = require('@hellocoop/fastify')

let version = 'debug'
try {
    ({ version } = require('./package-version.json'))
}
catch (err) {
    console.error('No package-version.json found, using debug version')
}

if (!process.env.HELLO_CLIENT_ID) {
    throw new Error('HELLO_CLIENT_ID is required')
}
if (!process.env.HELLO_COOKIE_SECRET) {
    throw new Error('HELLO_COOKIE_SECRET is required')
}

const loginTriggerUrl = process.env.LOGIN_TRIGGER_URL


const loginTrigger = async ( params ) => {
    const { payload } = params

    console.log('loginTrigger', {payload})

// future - use cbRes to set cookies that were returned from the login trigger

    try {
        const response = await fetch(loginTriggerUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })        
        if (!response.ok) {
            console.error('Login trigger failed', response.status, response.statusText)
            return {}
        }
        try {
            const json = await response.json()
            console.log('loginTrigger response', json)
            return json    
        } catch (err) {
            console.error('Login trigger did not return JSON', err)
        }
    } catch (err) {
        console.error('Login trigger failed', err)
    }
    return {}
}

const config = {
    logConfig: true,
}

if (loginTriggerUrl) {
    config.loginTrigger = loginTrigger
} else {
    console.error('No login trigger URL provided')
}

const app = fastify()

const port = process.env.PORT || 8000

app.register(helloAuth, config)

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