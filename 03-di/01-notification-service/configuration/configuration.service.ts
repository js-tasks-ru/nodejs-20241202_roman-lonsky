import * as fs from 'node:fs';
import { Injectable, Inject } from "@nestjs/common";
import { z } from "zod";

const ConfigSchema = z.object({
  emailGetway: z.string({
    required_error: "emailGetway not provided"
  }).nonempty(),
  smsGetway: z.string({
    required_error: "smsGetway not provided"
  }),
  someValue: z.string({
    required_error: "someValue not provided"
  })
});

type Config = z.infer<typeof ConfigSchema>;

const defaultOptions: Config = {
  emailGetway: 'default',
  smsGetway: 'default',
  someValue: 'default',
};

@Injectable()
export class ConfigurationService {
  private config: Config = defaultOptions;

  constructor(
    @Inject('CONFIG_FILE_NAME') private fileName: string,
    @Inject('CI') private ci: boolean
  ) {
    try {
      if (ci) {
        this.config = defaultOptions;

      } else {
        const config = JSON.parse(fs.readFileSync(this.fileName, 'utf8'));
        ConfigSchema.parse(config);

        this.config = config;

        console.log(this.config);
      }

    } catch (error) {
      // console.error(error);
      throw error;
    }
  }

  get options() {
    return this.config;
  }
}
