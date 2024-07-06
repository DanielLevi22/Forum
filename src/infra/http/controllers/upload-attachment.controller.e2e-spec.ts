import { INestApplication } from "@nestjs/common";
import { AppModule } from "@/infra/app.module";
import { Test } from "@nestjs/testing";
import request from 'supertest'
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { DataBaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { a } from "vitest/dist/suite-MFRDkZcV";


describe('Upload attachment', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule,DataBaseModule],
      providers: [StudentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    await app.init();
  });
  test('[POST] /attachments', async() => {

   const user = await studentFactory.makePrismaStudent()

  const accessToken = jwt.sign({sub: user.id.toString()})


  const response = await request(app.getHttpServer())
  .post(`/attachments`)
  .set('Authorization', 'Bearer ' + accessToken)
  .attach('file', './test/e2e/sample-upload.png')
    
 
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      attachmentId: expect.any(String)
    })


  })
})