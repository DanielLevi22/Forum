import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DataBaseModule } from "@/infra/database/database.module";
import { AnswerFactory } from "test/factories/make-answer";
describe('Fetch recent question answers (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory

  let questionFactory: QuestionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [StudentFactory,QuestionFactory,AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)


    await app.init();
  });
  test('[GET] /questions/:questionId/answers', async() => {

  const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})
  
  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  await Promise.all([
    answerFactory.makePrismaAnswer({authorId: user.id, content: 'answer 01', questionId: question.id}),
    answerFactory.makePrismaAnswer({authorId: user.id, content: 'answer 02' ,questionId: question.id}),
  ])

  const questionId = question.id.toString()
  const response = await request(app.getHttpServer())
  .get(`/questions/${questionId}/answers`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()


  console.log(response.body)
  
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      answers: expect.arrayContaining ([
        expect.objectContaining({content: 'answer 01'}),
        expect.objectContaining({content: 'answer 02'}),
       ])
    })

  })
})