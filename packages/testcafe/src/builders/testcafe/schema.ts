export interface SchemaObject {
    allowMultipleWindows?: boolean;
    assertionTimeout?: number;
    browsers?: string[]; // default in schema.json
    clientScripts?: string | string[]; //doesn't do anything yet
    color?: boolean;
    concurrency?: number;
    debugMode?: boolean;
    debugOnFail?: boolean;
    dev?: boolean;
    devServerTarget?: string; // set to run ng serve
    disablePageReloads?: boolean;
    disableScreenshots?: boolean;
    disableTestSyntaxValidation?: boolean;
    fixture?: string;
    fixtureGrep?: string;
    fixtureMeta?: object;
    host?: string; // default in schema.json
    live?: boolean; // default in schema.json
    NoColor?: boolean;
    pageLoadTimeout?: number;
    ports?: number[]; // testcafe ports
    proxy?: string;
    proxyBypass?: string[];
    quarantineMode?: boolean;
    reporters?: Reporter[]; // default in schema.json
    screenshots?: Screenshots;
    selectorTimeout?: number;
    skipJsErrors?: boolean;
    skipUncaughtErrors?: boolean;
    speed?: number;
    src: string | string[];
    ssl?: string;
    stopOnFirstFail?: boolean;
    test?: string;
    testGrep?: string;
    testMeta?: object;
    tsConfigPath?: string;
}

export interface Reporter {
    name: string,
    output?: string;
}

export interface Screenshots {
    path?: string;
    takeOnFails?: boolean;
    pathPattern?: string;
    fullPage?: boolean;
}