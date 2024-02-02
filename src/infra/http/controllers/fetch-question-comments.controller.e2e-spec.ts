import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DataBaseModule } from "@/infra/database/database.module";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
describe('Fetch  question answers (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory

  let questionFactory: QuestionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [StudentFactory,QuestionFactory,QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)


    await app.init();
  });
  test('[GET] /questions/:questionId/comments', async() => {

  const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})
  
  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  await Promise.all([
    questionCommentFactory.makePrismaQuestionComment({authorId: user.id, content: 'comment 01', questionId: question.id}),
    questionCommentFactory.makePrismaQuestionComment({authorId: user.id, content: 'comment 02' ,questionId: question.id}),
  ])

  const questionId = question.id.toString()
  const response = await request(app.getHttpServer())
  .get(`/questions/${questionId}/comments`)
  .set('Authorization', 'Bearer ' + accessToken)
  .send()



  
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining ([
        expect.objectContaining({content: 'comment 01'}),
        expect.objectContaining({content: 'comment 02'}),
       ])
    })

  })
})