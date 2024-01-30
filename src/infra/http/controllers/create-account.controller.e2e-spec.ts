import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService
 
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)

    await app.init();
  });
  test('[POST]', async() => {

  const response = await request(app.getHttpServer()).post('/accounts').send({
      name:'Daniel',
      email: 'daniel@email.com',
      password: '123456'
    })
    const userOnDataBase =  await prisma.user.findUnique({
      where: {
        email: 'daniel@email.com'
      }
    })
 
  expect(response.statusCode).toEqual(201)
  expect(userOnDataBase).toBeTruthy()

  })
})