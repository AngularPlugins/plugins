import { LoggerApi } from '@angular-devkit/core/src/logger';
import { SchemaObject as StylelintBuilderSchema } from './schema';

export class StylelintConfiguration {
  private readonly _config;

  constructor(private _logger: LoggerApi, private _workspaceRoot: string) {}

  validateConfig(options: StylelintBuilderSchema) {
    if (options.length === 0) {
      this._logger.error(
        'Invalid configuration: Make sure you are passing the right arguments - empty options'
      );
    }

    if (options.configFile) {
      return this.getConfigurationByFile(options.configFile);
    }
    return this.getConfigByParams(options);
  }

  getConfigByParams(options: StylelintBuilderSchema) {
    this._logger.debug(`Starting stylelint builder with params configuration`);
    
    this._config.extends = options.config.extends;
    this._config.rules = options.config.rules;
    this._config.plugins = options.config.plugins;
    this._config.plugins = options.config.plugins;
    this._config.ignoreFiles = options.config.ignoreFiles;
    this._config.defaultSeverity = options.config.defaultSeverity;


    this._logger.debug(`Stylelint Config ${JSON.stringify(this._config)}`);
    return this._config;
  }

  getConfigurationByFile(configFilePath: string) {
    this._logger.debug(
      `Starting stylelint builder with file configuration ${configFilePath}`
    );
    this._config.configFile = `${this._workspaceRoot}/${configFilePath}`;
    this._logger.debug(`Stylelint Config ${JSON.stringify(this._config)}`);
    return this._config;
  }
}
