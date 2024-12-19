import { Module, DynamicModule, Global } from "@nestjs/common";
import { ConfigurationService  } from './configuration.service';

@Global()
@Module({
  providers: [ConfigurationService],
  exports: [ConfigurationService]
})
export class ConfigurationModule {
  static forRoot(fileName: string): DynamicModule {
    return {
      module: ConfigurationModule,
      providers: [
        { provide: 'CONFIG_FILE_NAME', useFactory: () => fileName },
        { provide: 'CI', useValue: process.env.CI }
      ],
    };
  }
}
