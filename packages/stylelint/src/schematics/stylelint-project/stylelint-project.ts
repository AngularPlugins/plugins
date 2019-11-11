import {
    chain,
    externalSchematic,
    Rule,
    apply,
    url,
    template,
    move,
    Tree,
    TypedSchematicContext,
    SchematicContext,
    noop
  } from '@angular-devkit/schematics';
  import {
    getProjectConfig,
    getWorkspace,
    readJsonInTree,
    updateWorkspaceInTree,
    readWorkspace,
    addDepsToPackageJson
  } from '@nrwl/workspace';
  import { mergeWith } from '@angular-devkit/schematics';
  import { Schema } from './schema';
  import { join, normalize } from '@angular-devkit/core';
  import init from '../init/init';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { configsVersion } from '../../../utils/versions';
  
  function checkDependencies(options: Schema){
    return (host: Tree, context: SchematicContext): Rule => {
        const packageJson = readJsonInTree(host, 'package.json');
        const dependencyList: { name: string; version: string }[] = [];
        if (!packageJson.devDependencies['options.config.extends']) {
          context.addTask(new NodePackageInstallTask());
          dependencyList.push(
            { name: options.config.extends , version: configsVersion.extends[options.config.extends] },
          );
        }
        if (!dependencyList.length) {
            return noop();
          }
          
        return addDepsToPackageJson(
            {},
            dependencyList.reduce((dictionary, value) => {
              dictionary[value.name] = value.version;
              return dictionary;
            }, {})
          );
    }  
  }
  
  function generateFile(options: Schema): Rule {
    return (host, context) => {
      const workspaceJson = readWorkspace(host);
      const projectConfig = getProjectConfig(host, options.project);
     
  
      return mergeWith(
        apply(url('./files'), [
          template({
            tmpl: '',
            projectConfig,
            ...options,
          }),
  
          move(projectConfig.root)
        ])
      )(host, context);
    };
  }
  
  function updateWorkspaceJson(options: Schema): Rule {
    return updateWorkspaceInTree(json => {
      const projectConfig = json.projects[options.project];
      projectConfig.architect.stylelint = {
        builder: '@angular-plugins/stylelint:lint',
        options: {
          configFile: join(normalize(projectConfig.root), '.stylelintrc'),
          files: join(normalize(`${projectConfig.sourceRoot}/**/*`), `.${options.syntax}`),
          fix: options.fix,
          formatter: options.formatter
        }
      };
      return json;
    });
  }
  
  function checkArchitect(options: Schema): Rule {
    return (host: Tree, context: TypedSchematicContext<{}, {}>) => {
      const projectConfig = getProjectConfig(host, options.project);
      if (projectConfig.architect.stylelint) {
        throw new Error(
          `${options.project} already has a stylelint architect option.`
        );
      }
      return host;
    };
  }
  
  export default function(options: Schema): Rule {
    return chain([
      init(),
      checkArchitect(options),
      checkDependencies(options),
      generateFile(options),
      updateWorkspaceJson(options)
    ]);
  }
  