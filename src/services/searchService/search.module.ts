import { Module, OnModuleInit } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigurationModule } from "src/configs/configuration.module";
import { ConfigurationService } from "src/configs/configuration.service";
import { SearchService } from "./search.service";
import { LoggerModule } from "../loggerService/logger.module";

@Module({
  imports: [
    LoggerModule,
    ConfigurationModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: async (configurationService: ConfigurationService) => ({
        node: configurationService.esUrl,
        maxRetries: 10,
        requestTimeout: 30000,
      }),
      inject: [ConfigurationService],
    }),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private searchService: SearchService) {}
  async onModuleInit() {
    // await this.searchService.createIndex();
  }
}
