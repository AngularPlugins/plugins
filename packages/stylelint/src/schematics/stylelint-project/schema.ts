export interface Schema {
  project: string;
  config: {
    extends: string;
  };
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
