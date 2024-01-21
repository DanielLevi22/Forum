import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
describe('Fetch recent questions (E2E)', () => {
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
  test('[GET] /questions', async() => {

   const user = await prisma.user.create({
    data: {
      name:'Daniel',
      email: 'daniel@email.com',
      password: await hash('123456', 8)
    }
  })

  const accessToken = jwt.sign({sub: user.id})

  await prisma.question.createMany({
    data: [
      {
        title: 'Question 1',
        slug: 'Question 1',
        content: 'Question content',
        authorId: user.id
      },
      {
        title: 'Question 2',
        slug: 'Question 2',
        content: 'Question content',
        authorId: user.id
      },
      {
        title: 'Question 3',
        slug: 'Question 3',
        content: 'Question content',
        authorId: user.id
      },
    ]

  })

  const response = await request(app.getHttpServer())
  .get('/questions')
  .set('Authorization', 'Bearer ' + accessToken)
  .send()
    const questionOnDataBase =  await prisma.question.findFirst({
      where: {
        title: 'New Question'
      }
    })
 
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({title: 'Question 1'}),
        expect.objectContaining({title: 'Question 2'}),
        expect.objectContaining({title: 'Question 3'}),
       ]
    })

  })
})