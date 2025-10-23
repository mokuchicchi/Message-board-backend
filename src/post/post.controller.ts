import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Query('token') token: string,
    @Body('message') message: string,
  ) {
    return await this.postService.createPost(token, message);
  }

  @Get()
  async getList(
    @Query('token') token: string,
    @Query('start') start: number,
    @Query('records') records: number,
  ) {
    return await this.postService.getList(token, start, records);
  }

  @Delete()
  async deletePost(@Query('token') token: string, @Query('id') id: number) {
    return await this.postService.deletePost(token, id);
  }
}
