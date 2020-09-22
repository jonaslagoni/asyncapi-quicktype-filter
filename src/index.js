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
 * @param {String} schemaPath Path to the folder to store the generated files
 * @param {*} schemaName The name of the schema to generate
 * @param {*} jsonSchema The schema to generate
 */
async function quicktypeSchema(options, schemaName, jsonSchema) {
  const schemaString = JSON.stringify(jsonSchema.json());
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({ name: schemaName, schema: schemaString });
  const inputData = new InputData();
  inputData.addInput(schemaInput);
  const { lines } = await quicktype({
    lang: options.quicktypeLanguage,
    rendererOptions: options.rendererOptions,
    inputData,
  });
  await fs.promises
    .mkdir(options.targetDir, { recursive: true })
    .catch(console.error);
  fs.mkdirSync(options.targetDir, { recursive: true });
  fs.writeFileSync(
    Path.join(
      options.targetDir,
      `${pascalCase(schemaName)}.${options.fileExtension}`
    ),
    lines.join('\n')
  );
}

/**
 * @typedef Parameters
 * @type {object}
 * @property {string} subTargetDir - which relative target sub directory should it be rendered to. It is relative to where the generators targetDir
 * @property {string} rendererOptions - Provide a JSON object as a string which should be parsed to quicktype.
 * @property {SupportedLanguages} quicktypeLanguage - Which type of quicktype language should be generated.
 */

/**
 * @param {string} generatorTargetDir
 * @param {Parameters} parameters
 * @param {*} messages
 */
async function generateAllMessagePayloads(
  generatorTargetDir,
  parameters,
  messages
) {
  // Parse generator parameters
  const options = {
    quicktypeLanguage: null,
    fileExtension: null,
    targetDir: Path.join(generatorTargetDir, './'),
    rendererOptions: {},
  };
  if (parameters.subTargetDir) {
    options.targetDir = Path.join(generatorTargetDir, parameters.subTargetDir);
  }
  if (parameters.rendererOptions) {
    options.rendererOptions = JSON.parse(parameters.rendererOptions);
  }
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
  for (const [messageId, message] of messages) {
    const payloadSchema = message.payload();
    console.log(JSON.stringify(payloadSchema, null, 4));
    //Null payload is not supported by quicktype, and cannot be generated.
    if (`${payloadSchema.type()}` !== 'null') {
      await quicktypeSchema(options, messageId, payloadSchema);
    }
  }
}

module.exports = { generateAllMessagePayloads };
