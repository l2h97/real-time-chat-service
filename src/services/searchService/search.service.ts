import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { LoggerService } from "../loggerService/logger.service";
import {
  ISearchUser,
  mappingUserSearch,
  settingUserSearch,
} from "./search.interface";

@Injectable()
export class SearchService {
  private INDEX = "rtc_search";
  private USER_DOCUMENT = "users";
  constructor(
    private elasticsearchService: ElasticsearchService,
    private loggerService: LoggerService,
  ) {}

  async createIndex() {
    try {
      const checkIndex = await this.elasticsearchService.indices.exists({
        index: this.INDEX,
      });

      if (!checkIndex) {
        await this.elasticsearchService.indices.create({
          index: this.INDEX,
          // settings: settingUserSearch,
          // mappings: mappingUserSearch,
        });
      }
    } catch (error) {
      console.log("error::", error);
    }
  }

  async indexUsers(document: ISearchUser) {
    try {
      await this.elasticsearchService.index({
        index: this.INDEX,
        id: this.USER_DOCUMENT,
        document,
      });
    } catch (error) {
      console.log("SearchService::indexUsers", error);
    }
  }

  async searchUsers(
    data: string,
  ): Promise<{ total: number; result: ISearchUser[] }> {
    const searchData = await this.elasticsearchService.search<ISearchUser>({
      query: {
        // match: {
        //   id: data,
        // },
        match_all: {
          _name: data,
        },
      },
    });
    console.log("result::", searchData.hits.hits);
    console.log("result::", searchData);
    const result = searchData.hits.hits
      .map((item) => {
        return item._source;
      })
      .filter((item): item is ISearchUser => !!item);
    return {
      total: searchData._shards.total,
      result,
    };
  }
}
