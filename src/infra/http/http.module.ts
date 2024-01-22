import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionsController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DataBaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

@Module({
  imports: [ DataBaseModule],
  controllers: [CreateAccountController,AuthenticateController,CreateQuestionsController,FetchRecentQuestionsController],
  providers: [CreateQuestionUseCase,FetchRecentQuestionsUseCase]
})
export class HttpModule {

}