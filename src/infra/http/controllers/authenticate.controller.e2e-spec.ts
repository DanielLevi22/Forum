import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcryptjs";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
describe(' Authenticate (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [ StudentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory =  moduleRef.get(StudentFactory)
    await app.init();
  });
  test('[POST] /sessions', async() => {

    await studentFactory.makePrismaStudent({
      email: 'daniel@email.com',
      password: await hash('123456', 8)
    })


  const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'daniel@email.com',
      password:  '123456'
    })
  
  expect(response.statusCode).toBe(201)
  expect(response.body).toEqual({
    access_token: expect.any(String)
  })

  })
})