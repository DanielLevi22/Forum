import {Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "@/infra/auth/jwt.auth.guard";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";

const pageQueryParamsSchema = z.string().optional().default('1').transform(Number).pipe(
  z.number().min(1)
)
const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)
type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>



@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController{

  constructor(
    private prisma: PrismaService
  )
   { }

@Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamsSchema) {

    const pearPage = 20
    const questions = await this.prisma.question.findMany({
      take: pearPage,
      skip:(page -1) * pearPage,
      orderBy: {
        createdAt: 'desc'
      }
    })
    return {
      questions
    }
  }
}

