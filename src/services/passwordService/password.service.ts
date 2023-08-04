import { Injectable } from "@nestjs/common";
import { compare, genSalt, hash } from "bcrypt";
import { ConfigurationService } from "src/configs/configuration.service";

@Injectable()
export class PasswordService {
  constructor(private configurationService: ConfigurationService) {}

  async hashPassword(
    password: string,
  ): Promise<{ salt: string; passwordHashed: string }> {
    const saltRounds = this.configurationService.saltRounds;
    const salt = await genSalt(saltRounds);
    const passwordHashed = await hash(password, salt);

    return {
      salt,
      passwordHashed,
    };
  }

  async comparePassword(password: string, passwordHashed: string) {
    return compare(password, passwordHashed);
  }
}
