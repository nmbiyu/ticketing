import request from 'supertest';
import { app } from '../app';

export const signup = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    return response.get('Set-Cookie');
}