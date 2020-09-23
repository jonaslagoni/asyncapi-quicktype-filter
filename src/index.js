const fs = require('fs');
const Path = require('path');
const _ = require('lodash');
const {
  quicktype,
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
} = require('quicktype-core');

function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @typedef {string} SupportedLanguages
 **/

/**
 * Enum for supported languages by this filter
 * @readonly
 * @enum {SupportedLanguages}
 */
const SUPPORTED_LANGUAGES = {
  cplusplus: 'cplusplus',
  csharp: 'csharp',
  crystal: 'crystal',
  dart: 'dart',
  elm: 'elm',
  golang: 'golang',
  haskell: 'haskell',
  java: 'java',
  jsonschema: 'json-schema',
  javascript: 'javascript',
  javascriptproptypes: 'javascript-prop-types',
  kotlin: 'kotlin',
  pike: 'pike',
  python: 'python',
  rust: 'rust',
  ruby: 'ruby',
  swift: 'swift',
  typescript: 'typescript',
};

/**
 * Generate a typescript structure from a schema.
 *
 * @private
 * @param {Options} options Path to the folder to store the generated files
 * @param {string} schemaName The name of the schema to generate
 * @param {*} jsonSchema The schema to generate
 */
async function quicktypeSchema(options, schemaName, jsonSchema) {
  const schemaString = JSON.stringify(jsonSchema.json());
  const renderOptions = getDefaultRenderOptions(options, schemaName, jsonSchema);
  console.log(`Rendering schema ${schemaName} with render options ${JSON.stringify(renderOptions, null, 4)}`);
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({ name: schemaName, schema: schemaString });
  const inputData = new InputData();
  inputData.addInput(schemaInput);
  const { lines } = await quicktype({
    lang: options.quicktypeLanguage,
    rendererOptions: renderOptions,
    inputData,
  });
  const targetDir = Path.join(options.generatorTargetDir, options.targetDir);
  await fs.promises
    .mkdir(targetDir, { recursive: true })
    .catch(console.error);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(
    Path.join(
      targetDir,
      `${pascalCase(schemaName)}.${options.fileExtension}`
    ),
    lines.join('\n')
  );
}

/**
 * Some renderings require custom render parameters to work, get them there.
 *
 * @private
 * @param {Options} options Path to the folder to store the generated files
 * @param {string} schemaName The name of the schema to generate
 * @param {*} jsonSchema The schema to generate
 * @returns {object} render options
 */
function getDefaultRenderOptions(options, schemaName, jsonSchema) {
  const renderOptions = {... options.renderOptions};
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (options.quicktypeLanguage) {
  case SUPPORTED_LANGUAGES.csharp:
    //Each schema require custom namespace and not common since otherwise schema names will clash.
    if (!renderOptions.namespace) {
      renderOptions.namespace = `${pascalCase(schemaName)}NameSpace`;
    }
    break;
  case SUPPORTED_LANGUAGES.java:
    //Each schema require custom namespace and not common since otherwise schema names will clash.
    if (!renderOptions.packageName) {
      if (options.parameters.subTargetDir) {
        renderOptions.package = options.parameters.subTargetDir.replace(/\//g, '.').replace('src.main.java.', '');
      } else {
        renderOptions.package = options.targetDir.replace(/\//g, '.').replace('src.main.java.', '');
      }
    }
    break;
  }
  return renderOptions;
}

/**
 * Options are used for internal function.
 * 
 * @private
 * @typedef Options
 * @type {object}
 * @property {Parameters} parameters - Parameters provided to the public methods.
 * @property {string} generatorTargetDir - The target directory the generator are provided.
 * @property {SupportedLanguages} quicktypeLanguage - the language to generate.
 * @property {string} fileExtension - File extension the language should use for the files.
 * @property {string} targetDir - The partial target directory within the generatorTargetDir.
 * @property {*} renderOptions - Options that should be provided to the Quicktype render engine.
 */

/**
 * parse the parameters from the template and return the options to use for rendering
 * @private
 * @param {string} generatorTargetDir - The target directory the generator are provided.
 * @param {Parameters} parameters - Parameters provided to the public methods.
 * @returns {Options} options to use
 */
function getOptions(
  generatorTargetDir,
  parameters) {
  const options = {
    parameters,
    quicktypeLanguage: null,
    fileExtension: null,
    generatorTargetDir,
    targetDir: '',
    renderOptions: {},
  };
  // Parse generator parameters
  if (parameters.quicktypeLanguage) {
    switch (parameters.quicktypeLanguage) {
    case SUPPORTED_LANGUAGES.cplusplus:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.cplusplus;
      options.fileExtension = 'cpp';
      break;
    case SUPPORTED_LANGUAGES.csharp:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.csharp;
      options.fileExtension = 'cs';
      break;
    case SUPPORTED_LANGUAGES.crystal:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.crystal;
      options.fileExtension = 'cr';
      break;
    case SUPPORTED_LANGUAGES.dart:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.dart;
      options.fileExtension = 'dart';
      break;
    case SUPPORTED_LANGUAGES.elm:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.elm;
      options.fileExtension = 'elm';
      break;
    case SUPPORTED_LANGUAGES.golang:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.golang;
      options.fileExtension = 'go';
      break;
    case SUPPORTED_LANGUAGES.haskell:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.haskell;
      options.fileExtension = 'hs';
      break;
    case SUPPORTED_LANGUAGES.java:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.java;
      options.targetDir = 'src/main/java/io/quicktype';
      options.fileExtension = 'java';
      break;
    case SUPPORTED_LANGUAGES.jsonschema:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.jsonschema;
      options.fileExtension = 'json';
      break;
    case SUPPORTED_LANGUAGES.javascript:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.javascript;
      options.fileExtension = 'js';
      break;
    case SUPPORTED_LANGUAGES.javascriptproptypes:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.javascriptproptypes;
      options.fileExtension = 'js';
      break;
    case SUPPORTED_LANGUAGES.kotlin:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.kotlin;
      options.fileExtension = 'kt';
      break;
    case SUPPORTED_LANGUAGES.pike:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.pike;
      options.fileExtension = 'pike';
      break;
    case SUPPORTED_LANGUAGES.python:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.python;
      options.fileExtension = 'py';
      break;
    case SUPPORTED_LANGUAGES.rust:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.rust;
      options.fileExtension = 'rs';
      break;
    case SUPPORTED_LANGUAGES.ruby:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.ruby;
      options.fileExtension = 'rb';
      break;
    case SUPPORTED_LANGUAGES.swift:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.swift;
      options.fileExtension = 'swift';
      break;
    case SUPPORTED_LANGUAGES.typescript:
      options.quicktypeLanguage = SUPPORTED_LANGUAGES.typescript;
      options.fileExtension = 'ts';
      break;
    default:
      throw new Error(`${parameters.quicktypeLanguage} are not supported.`);
      break;
    }
  } else {
    throw new Error(
      `Parameter ${parameters.quicktypeLanguage} are not provided in the generator.`
    );
  }
  
  if (parameters.subTargetDir) {
    options.targetDir = parameters.subTargetDir;
  }

  // Unwrap render options
  if (parameters.renderOptions) {
    const renderOptionsToUse = JSON.parse(parameters.renderOptions);
    options.parameters.renderOptions = renderOptionsToUse;
    for (const optionKey in renderOptionsToUse) {
      if (renderOptionsToUse.hasOwnProperty(optionKey)) {
        const option = renderOptionsToUse[optionKey];
        options.renderOptions[optionKey] = option;
      }
    }
  }
  return options;
}

/**
 * @typedef Parameters
 * @type {object}
 * @property {string} subTargetDir - which relative target sub directory should it be rendered to. It is relative to where the generators targetDir
 * @property {string} renderOptions - Provide a JSON object as a string which should be parsed to quicktype.
 * @property {SupportedLanguages} quicktypeLanguage - Which type of quicktype language should be generated.
 */

/**
 * @param {string} generatorTargetDir - The target directory the generator are provided.
 * @param {Parameters} parameters - Parameters provided to the public methods.
 * @param {*} messages - AsyncAPI messages provided by the AsyncAPI parser.
 */
async function generateAllMessagePayloads(
  generatorTargetDir,
  parameters,
  messages
) {
  const options = getOptions(generatorTargetDir, parameters);
  console.log(`Generating files with options ${JSON.stringify(options, null, 4)}`);
  
  for (const [messageId, message] of messages) {
    const payloadSchema = message.payload();
    //Null payload is not supported by quicktype, and cannot be generated.
    if (`${payloadSchema.type()}` !== 'null') {
      await quicktypeSchema(options, messageId, payloadSchema);
    }
  }
}

module.exports = { generateAllMessagePayloads };
