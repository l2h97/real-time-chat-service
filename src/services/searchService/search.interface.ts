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
  number_of_shards: 3,
  number_of_replicas: 2,
  analysis: {
    analyzer: {
      rtc_user_search: {
        type: "standard",
      },
    },
  },
};

export const mappingUserSearch: MappingTypeMapping = {
  dynamic: "strict",
  properties: {
    id: {
      type: "text",
    },
    fullName: {
      properties: {
        firstName: {
          type: "text",
          analyzer: "rtc_user_search",
        },
        lastName: {
          type: "text",
          analyzer: "rtc_user_search",
        },
      },
    },
    email: {
      type: "text",
      analyzer: "rtc_user_search",
    },
    profileImage: {
      type: "text",
    },
  },
};
