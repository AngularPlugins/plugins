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

export function createDeployRunner(
  options: DeployBuilderSchema,
  { logger, workspaceRoot }: BuilderContext
): Observable<BuilderOutput> {
  logger.info('Start npm deploy builder' + JSON.stringify(options));

  const workspacePackageJSON = readJsonFile('package.json');

  const libraryPackageJson = readJsonFile(options.packageJsonPath);

  const unlinkFileObservable = bindNodeCallback(unlink);
  const execObservable = bindNodeCallback(exec);
  return unlinkFileObservable(options.packageJsonPath).pipe(
    map(() => {
      writeJsonFile(options.packageJsonPath, {
        ...libraryPackageJson,
        version: workspacePackageJSON.version
      });
    }),
    switchMap(()=>{ 
        return execObservable(`npm publish ${options.packageJsonPath.replace("package.json","")} --access public`);
    }),
    map(()=>{
        return { success: true };
    }),
    tap(() => logger.warn('npm deploy ran successfully')),
    catchError(e => {
      logger.error('Failed to ran npm deploy', e);
      return of({ success: false });
    })
  );
}

export default createBuilder<json.JsonObject & DeployBuilderSchema>(
  createDeployRunner
);
