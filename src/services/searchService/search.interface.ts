import {
  IndicesIndexSettings,
  MappingTypeMapping,
} from "@elastic/elasticsearch/lib/api/types";

export interface ISearchUser {
  id: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  profileImage: string;
}

export const settingUserSearch: IndicesIndexSettings = {
  analysis: {
    analyzer: {
      rtc_search_text: {
        type: "custom",
        tokenizer: "standard",
        filter: ["lowercase", "asciifolding"],
      },
    },
  },
};

export const mappingUserSearch: MappingTypeMapping = {
  properties: {
    id: {
      type: "text",
    },
    fullName: {
      properties: {
        firstName: {
          type: "text",
          analyzer: "rtc_search_text",
        },
        lastName: {
          type: "text",
          analyzer: "rtc_search_text",
        },
      },
    },
    email: {
      type: "text",
      analyzer: "rtc_search_text",
    },
    profileImage: {
      type: "text",
    },
  },
};
