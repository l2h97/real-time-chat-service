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
      console.log("success");
    } catch (error) {
      console.log("SearchService::indexUsers", error);
    }
  }

  async searchUsers(
    data: string,
  ): Promise<{ total: number; result: ISearchUser[] }> {
    console.log("data::", data);

    const result = await this.elasticsearchService.search<ISearchUser>({
      query: {
        match: {
          id: data,
        },
      },
    });
    console.log("result::", result.hits.hits);
    console.log("result::", result);
    return {
      total: Number(result.hits.total) || 0,
      result: result.hits.hits.map((item): ISearchUser => {
        return {
          id: item._source?.id || "",
          fullName: {
            firstName: item._source?.fullName?.firstName || "",
            lastName: item._source?.fullName?.lastName || "",
          },
          email: item._source?.email || "",
          profileImage: item._source?.profileImage || "",
        };
      }),
    };
  }
}
