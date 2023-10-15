import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./services/searchService/search.service";

@ApiTags("app")
@Controller()
export class AppController {
  constructor(private searchService: SearchService) {}

  @Get("ping")
  @HttpCode(HttpStatus.OK)
  ping() {
    return "PONG";
  }

  @Get("search")
  @HttpCode(HttpStatus.OK)
  async search(@Query("q") query: string) {
    return await this.searchService.searchUsers(query);
  }
}
