import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";


describe('Get question By Slug (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)


    await app.init();
  });
  test('[GET] /questions/:slug', async() => {

   const user = await prisma.user.create({
    data: {
      name:'Daniel',
      email: 'daniel@email.com',
      password: await hash('123456', 8)
    }
  })

  const accessToken = jwt.sign({sub: user.id})

  await prisma.question.create({
    data: {
      title: 'Question 01',
      slug: 'Question-01',
      content: 'Question content',
      authorId: user.id
    }
  })

  const response = await request(app.getHttpServer())
  .get(`/questions/Question-01`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()
    
 
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      question:  expect.objectContaining({title: 'Question 01'}),
    })

  })
})