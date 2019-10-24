export interface SchemaObject {
    length: number;
    config?: {
        extends?: string,
        rules?: {[key: string]: any},
        plugins?: string[],
        processors?: string[],
        ignoreFiles?: string[],
        defaultSeverity?: string
    }
    configFile?: string;
    formatter?: string;
    syntax?: string;
    fix?: string;
  }