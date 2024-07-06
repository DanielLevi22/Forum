import {BadRequestException, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadAndCreateAttachmentCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import { InvalidAttachmentTypeError } from "@/domain/forum/application/use-cases/erros/invalid-attachment-type";




@Controller('/attachments')
export class UploadAttachmentController{

  constructor(
    private  uploadAndAttachmentCase: UploadAndCreateAttachmentCase
  )
   { }

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

    const  result = await this.uploadAndAttachmentCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    });

    
  if(result.isLeft()){
    const error = result.value
    switch(error.constructor){
      case InvalidAttachmentTypeError: 
        throw new BadRequestException(error.message)
      
        default:
          throw new BadRequestException(error.message)
      }
  }

  const { attachment } = result.value

  return {
    attachmentId: attachment.id.toString()
  }
  }
}

