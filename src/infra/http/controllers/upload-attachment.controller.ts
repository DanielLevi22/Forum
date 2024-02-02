import {BadRequestException, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { FileInterceptor } from "@nestjs/platform-express";




@Controller('/attachments')
export class UploadAttachmentController{

  // constructor(
  // )
  //  { }

@Post()
@UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2 //2 mb 
      }),
        new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
      ],
    }),
  ) 
  file: Express.Multer.File
  ) {

  
  }
}

