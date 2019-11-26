export interface SchemaObject extends Object {
  files: string;
  config?: {
    extends?: string;
    rules?: { [key: string]: any };
    plugins?: string[];
    processors?: string[];
    ignoreFiles?: string[];
    defaultSeverity?: string;
  };
  configFile?: string;
  formatter?: 'compact' | 'json' | 'string' | 'unix' | 'verbose';
  syntax?:
    | 'css-in-js'
    | 'html'
    | 'less'
    | 'markdown'
    | 'sass'
    | 'scss'
    | 'sugarss';
  fix?: string;
}
