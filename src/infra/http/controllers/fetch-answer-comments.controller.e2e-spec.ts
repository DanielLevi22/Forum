import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-question";
import { DataBaseModule } from "@/infra/database/database.module";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
describe('Fetch Answer comment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DataBaseModule],
      providers: [StudentFactory,QuestionFactory,QuestionCommentFactory,AnswerFactory,AnswerCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)



    await app.init();
  });
  test('[GET] /answer/:answerId/comments', async() => {

  const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})
  
  const question = await questionFactory.makePrismaQuestion({
    authorId: user.id,
  })

  const answer = await answerFactory.makePrismaAnswer({
    questionId: question.id,
    authorId: user.id
  })

  await Promise.all([
    answerCommentFactory.makePrismaAnswerComment({authorId: user.id, content: 'comment 01', answerId: answer.id}),
    answerCommentFactory.makePrismaAnswerComment({authorId: user.id, content: 'comment 02' ,answerId: answer.id}),
  ])

  const answerId = answer.id.toString()
  const response = await request(app.getHttpServer())
  .get(`/answer/${answerId}/comments`)
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