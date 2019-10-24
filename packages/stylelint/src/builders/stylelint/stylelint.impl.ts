import { SchemaObject as StylelintBuilderSchema } from './schema';
import {
  BuilderContext,
  BuilderOutput,
  createBuilder
} from '@angular-devkit/architect';
import { Observable, from, of } from 'rxjs';
import Stryker from '@stryker-mutator/core';
import { map, tap, catchError } from 'rxjs/operators';
import { json } from '@angular-devkit/core';
import { stylelint } from 'stylelint';
import { StylelintConfiguration } from './build';

export function createStylelintRunner(
  options: StylelintBuilderSchema,
  { logger, workspaceRoot }: BuilderContext
): Observable<BuilderOutput> {
  logger.info('Start stylelint builder' + JSON.stringify(options));
  const config = new StylelintConfiguration(logger, workspaceRoot).validateConfig(
    options
  );
  return from(stylelint.lint(options)).pipe(
    map(() => ({ success: true })),
    tap(() => logger.warn('Stylelint ran successfully')),
    catchError(e => {
        logger.warn('Failed to ran stylelint')
        return of({ success: false });
      })
  )
}

export default createBuilder<json.JsonObject & StylelintBuilderSchema>(
  createStylelintRunner
);
