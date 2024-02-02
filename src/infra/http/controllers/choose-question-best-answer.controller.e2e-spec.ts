import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
import { AnswerFactory } from "test/factories/make-answer";

describe('Choose question best answer  (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory

  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [StudentFactory,QuestionFactory,AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)



    studentFactory = moduleRef.get(StudentFactory)

    await app.init();
  });
  test('[PATCH] /answerS/:answerId/choose-as-best', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})

  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id
  })

  const answer = await answerFactory.makePrismaAnswer({
    questionId: question.id,
    authorId: user.id
  })

  const answerId = answer.id.toString()
  const response = await request(app.getHttpServer())
  .patch(`/answers/${answerId}/choose-as-best`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()
    expect(response.statusCode).toEqual(204)
  
    const questionOnDataBase =  await prisma.question.findUnique({
      where: {
        id: question.id.toString()
      }
    })
 
  expect(questionOnDataBase?.bestAnswerId).toEqual(answerId)

  })
})