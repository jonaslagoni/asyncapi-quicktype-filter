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
		rendererOptions: options.render,
		inputData,
	});
	await fs.promises
		.mkdir(options.targetDir, { recursive: true })
		.catch(console.error);
	fs.mkdirSync(options.targetDir, { recursive: true });
	fs.writeFileSync(
		Path.join(
			options.targetDir,
			pascalCase(schemaName),
			'.',
			option.fileExtension
		),
		lines.join('\n')
	);
}

/**
 * @typedef Parameters
 * @type {object}
 * @property {string} subTargetDir - which relative target sub directory should it be rendered to. It is relative to where the generators targetDir
 * @property {string} rendererOptions - Provide a JSON object as a string which should be parsed to quicktype.
 * @property {SupportedLanguages} quicktypeLanguage - Which type of language should be generated.
 */

/**
 * 
 * @param {Parameters} parameters 
 * @param {*} messages 
 */
async function generateAllMessagePayloads(parameters, messages) {
	// Parse generator parameters
	var options = {
		quicktypeLanguage: null,
		fileExtension: null,
		targetDir: Path.join(generator.targetDir, './'),
		rendererOptions: {},
	};
	if (parameters.subTargetDir) {
		generatorOptions.targetDir = Path.join(
			generator.targetDir,
			parameters.subTargetDir
		);
	}
	if (parameters.rendererOptions) {
		generatorOptions.rendererOptions = JSON.parse(rendererOptions);
	}
	if (parameters.quicktypeLanguage) {
		switch (parameters.quicktypeLanguage) {
			case SUPPORTED_LANGUAGES.cplusplus:
				options.language = SUPPORTED_LANGUAGES.cplusplus;
				options.fileExtension = 'cpp';
				break;
			case SUPPORTED_LANGUAGES.csharp:
				options.language = SUPPORTED_LANGUAGES.csharp;
				options.fileExtension = 'cs';
				break;
			case SUPPORTED_LANGUAGES.crystal:
				options.language = SUPPORTED_LANGUAGES.crystal;
				options.fileExtension = 'cr';
				break;
			case SUPPORTED_LANGUAGES.dart:
				options.language = SUPPORTED_LANGUAGES.dart;
				options.fileExtension = 'dart';
				break;
			case SUPPORTED_LANGUAGES.elm:
				options.language = SUPPORTED_LANGUAGES.elm;
				options.fileExtension = 'elm';
				break;
			case SUPPORTED_LANGUAGES.golang:
				options.language = SUPPORTED_LANGUAGES.golang;
				options.fileExtension = 'go';
				break;
			case SUPPORTED_LANGUAGES.haskell:
				options.language = SUPPORTED_LANGUAGES.haskell;
				options.fileExtension = 'hs';
				break;
			case SUPPORTED_LANGUAGES.java:
				options.language = SUPPORTED_LANGUAGES.java;
				options.fileExtension = 'java';
				break;
			case SUPPORTED_LANGUAGES.jsonschema:
				options.language = SUPPORTED_LANGUAGES.jsonschema;
				options.fileExtension = 'json';
				break;
			case SUPPORTED_LANGUAGES.javascript:
				options.language = SUPPORTED_LANGUAGES.javascript;
				options.fileExtension = 'js';
				break;
			case SUPPORTED_LANGUAGES.javascriptproptypes:
				options.language = SUPPORTED_LANGUAGES.javascriptproptypes;
				options.fileExtension = 'js';
				break;
			case SUPPORTED_LANGUAGES.kotlin:
				options.language = SUPPORTED_LANGUAGES.kotlin;
				options.fileExtension = 'kt';
				break;
			case SUPPORTED_LANGUAGES.pike:
				options.language = SUPPORTED_LANGUAGES.pike;
				options.fileExtension = 'pike';
				break;
			case SUPPORTED_LANGUAGES.python:
				options.language = SUPPORTED_LANGUAGES.python;
				options.fileExtension = 'py';
				break;
			case SUPPORTED_LANGUAGES.rust:
				options.language = SUPPORTED_LANGUAGES.rust;
				options.fileExtension = 'rs';
				break;
			case SUPPORTED_LANGUAGES.ruby:
				options.language = SUPPORTED_LANGUAGES.ruby;
				options.fileExtension = 'rb';
				break;
			case SUPPORTED_LANGUAGES.swift:
				options.language = SUPPORTED_LANGUAGES.swift;
				options.fileExtension = 'swift';
				break;
			case SUPPORTED_LANGUAGES.typescript:
				options.language = SUPPORTED_LANGUAGES.typescript;
				options.fileExtension = 'ts';
				break;
			default:
				throw `${parameters.quicktypeLanguage} are not supported.`;
				break;
		}
	} else {
		throw `option 'quicktypeLanguage' are not provided in the generator.`;
	}
	for (let [messageId, message] of messages) {
		const payloadSchema = message.payload();
		//Null payload is not supported by quicktype, and cannot be generated.
		if (payloadSchema.type() + '' != 'null') {
			await quicktypeSchema(options, messageId, message.payload());
		}
	}
}

module.exports = { generateAllMessagePayloads };
