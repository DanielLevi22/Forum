import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
describe('Create question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [StudentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)

    await app.init();
  });
  test('[POST] /questions', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})


  const response = await request(app.getHttpServer())
  .post('/questions')
  .set('Authorization', 'Bearer ' + accessToken)
  .send({
      title:'New Question',
      content: 'Question Content',
    })
    const questionOnDataBase =  await prisma.question.findFirst({
      where: {
        title: 'New Question'
      }
    })
 
  expect(response.statusCode).toEqual(201)
  expect(questionOnDataBase).toBeTruthy()

  })
})