import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
  abstract creatMany(attachment: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachment: QuestionAttachment[]): Promise<void>
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
}
