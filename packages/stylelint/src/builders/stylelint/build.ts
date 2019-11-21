import { LoggerApi } from '@angular-devkit/core/src/logger';
import { SchemaObject as StylelintBuilderSchema } from './schema';
import { SchemaObject } from 'packages/stryker/src/builders/mutate/schema';

export class StylelintConfiguration {
  private readonly _config;

  constructor(private _logger: LoggerApi, private _workspaceRoot: string) {}

  validateConfig(options: StylelintBuilderSchema) {
    // For now only allow configuration by ConfigFile
    const lengthOptions = options as any;
    if (lengthOptions.length === 0) {
      this._logger.error(
        'Invalid configuration: Make sure you are passing the right arguments - empty options'
      );
    }

    if (!options.configFile) {
      this._logger.error(
        'Invalid configuration: Make sure you are passing a configFile'
      );
    }
    return options;
  }

}
