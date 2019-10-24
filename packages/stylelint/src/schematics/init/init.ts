import {
    chain,
    noop,
    Rule,
    Tree,
    SchematicContext
  } from '@angular-devkit/schematics';
  import {
    addDepsToPackageJson,
    readJsonInTree,
    updateJsonInTree
  } from '@nrwl/workspace';

  import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { stylelintVersion, pluginsVersion } from '../../../utils/versions';
  
  function checkDependenciesInstalled(): Rule {
    return (host: Tree, context: SchematicContext): Rule => {
      const packageJson = readJsonInTree(host, 'package.json');
      const dependencyList: { name: string; version: string }[] = [];
      if (!packageJson.devDependencies['stylelint']) {
        context.addTask(new NodePackageInstallTask());
        dependencyList.push(
          { name: 'stylelint', version: stylelintVersion },
        );
      }

      if (!packageJson.devDependencies['@angular-plugins/stylelint']) {
        context.addTask(new NodePackageInstallTask());
        dependencyList.push(
          { name: '@angular-plugins/stylelint', version: pluginsVersion },
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
    };
  }
  
  function installDependencies(
    dependencyList: { name: string; version: string }[]
  ) {
    return (host: Tree, context: SchematicContext): Rule => {
      return addDepsToPackageJson(
        {},
        dependencyList.reduce((dictionary, value) => {
          dictionary[value.name] = value.version;
          return dictionary;
        }, {})
      );
      context.logger.info(
        '@angular-plugins/stylelint dependencies installed successfully'
      );
    };
  }
  
  function removeDependency() {
    return updateJsonInTree('package.json', json => {
      json.dependencies = json.dependencies || {};
      delete json.dependencies['stylelint'];
      delete json.dependencies['@angular-plugins/stylelint'];
      return json;
    });
  }
  
  export default function() {
    return chain([removeDependency(), checkDependenciesInstalled()]);
  }
  