const request = require('supertest');
const expect = require('chai').expect;
const child = require('child_process');

let serverProcess;
const spawnServer = () => {
  serverProcess = child.spawn('node', ['server.js'], { env: { ...process.env, PORT: 4000 }});
  return new Promise(resolve => {
    serverProcess.stdout.on('data', data => {
      if (data.toString().includes('running')) resolve();
    });
  });
};

const killServer = () => serverProcess && serverProcess.kill();

describe('Student API', function () {
  this.timeout(10000);
  before(async () => { await spawnServer(); });
  after(() => killServer());

  let token;
  it('register -> login', async () => {
    await request('http://localhost:4000').post('/auth/register').send({ username: 'tuser', password: 'pass' }).expect(201);
    const res = await request('http://localhost:4000').post('/auth/login').send({ username: 'tuser', password: 'pass' }).expect(200);
    expect(res.body).to.have.property('token');
    token = res.body.token;
  });

  let created;
  it('create student', async () => {
    const res = await request('http://localhost:4000').post('/students').set('Authorization', `Bearer ${token}`).send({ name: 'John', age: 21 }).expect(201);
    expect(res.body).to.have.property('id');
    created = res.body;
  });

  it('get students', async () => {
    const res = await request('http://localhost:4000').get('/students').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body).to.be.an('array');
  });

  it('update student', async () => {
    const res = await request('http://localhost:4000').patch(`/students/${created.id}`).set('Authorization', `Bearer ${token}`).send({ age: 22 }).expect(200);
    expect(res.body.age).to.equal(22);
  });

  it('delete student', async () => {
    await request('http://localhost:4000').delete(`/students/${created.id}`).set('Authorization', `Bearer ${token}`).expect(204);
  });
});
