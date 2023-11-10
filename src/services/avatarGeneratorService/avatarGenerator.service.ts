import { HttpStatus, Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { ConfigurationService } from "src/configs/configuration.service";

@Injectable()
export class AvatarGenerateService {
  private avatarInstance: AxiosInstance;

  constructor(private configurationService: ConfigurationService) {
    this.avatarInstance = axios.create({
      baseURL: this.configurationService.avatarGenerateUrl,
      timeout: 10000,
    });
  }

  async avatarGenerator(fullName: string) {
    const url = `?api_key=${this.configurationService.avatarGenerateKey}&name=${fullName}`;

    try {
      const response = await this.avatarInstance.get<Buffer>(url, {
        responseType: "arraybuffer",
      });

      if (response.data && response.status === HttpStatus.OK) {
        return response.data;
      }

      return;
    } catch (error) {
      return;
    }
  }
}
