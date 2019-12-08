import { SchemaObject as DeployBuilderSchema } from './schema';
import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, from, bindNodeCallback, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { json } from '@angular-devkit/core';
import { unlink } from 'fs';
import {
  writeJsonFile,
  readJsonFile
} from '@nrwl/workspace/src/utils/fileutils';
import { exec } from 'child_process';
import { promises } from 'dns';


export function createDeployRunner(
  options: DeployBuilderSchema,
  { logger, workspaceRoot }: BuilderContext
): Observable<BuilderOutput> {
  logger.info('Start npm deploy builder' + JSON.stringify(options));


  const libraryPackageJson = readJsonFile(options.packageJsonPath);

  const unlinkFileObservable = bindNodeCallback(unlink);
  const execObservable = bindNodeCallback(exec);

  return unlinkFileObservable(options.packageJsonPath).pipe(
    switchMap(()=>{
      return from(executeCommand(logger,`git describe --tags`))
    }),
    map((version) => {
      logger.warn(`The version to use ${version
        }`);
      writeJsonFile(options.packageJsonPath, {
        ...libraryPackageJson,
        version: version.replace('\n',"").replace('v',"")
      });
    }),
    switchMap(()=>{ 
        return execObservable(`npm publish ${options.packageJsonPath.replace("package.json","")} --access public`);
    }),
    map(()=>{
        return { success: true };
    }),
    tap(() => logger.info('npm deploy ran successfully')),
    catchError(e => {
      logger.error(`Failed to ran npm deploy ${e}`);
      return of({ success: false });
    })
  );
}


function executeCommand(logger, command): Promise<any>{
  var ChildProcess = require('child_process');

  return new Promise((res,rej) => {
    const a  = ChildProcess.exec('git describe --tags');
    a.stdout.on('data', data => {
        logger.info(`Current Tag Version ${data}`);
        res(data);
      });
      a.stderr.on('data', err => {
        logger.error(`There is an error ${err}`);
        rej(err);
      });
  });
}
export default createBuilder<json.JsonObject & DeployBuilderSchema>(
  createDeployRunner
);
