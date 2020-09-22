## Functions

<dl>
<dt><a href="#quicktypeSchema">quicktypeSchema(schemaPath, schemaName, jsonSchema)</a></dt>
<dd><p>Generate a typescript structure from a schema.</p>
</dd>
<dt><a href="#generateAllMessagePayloads">generateAllMessagePayloads(generatorTargetDir, parameters, messages)</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SupportedLanguages">SupportedLanguages</a> : <code>string</code></dt>
<dd></dd>
<dt><a href="#Parameters">Parameters</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="SUPPORTED_LANGUAGES"></a>

## SUPPORTED\_LANGUAGES : <code>enum</code>
Enum for supported languages by this filter

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| cplusplus | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>cplusplus</code> | 
| csharp | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>csharp</code> | 
| crystal | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>crystal</code> | 
| dart | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>dart</code> | 
| elm | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>elm</code> | 
| golang | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>golang</code> | 
| haskell | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>haskell</code> | 
| java | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>java</code> | 
| jsonschema | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>json-schema</code> | 
| javascript | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>javascript</code> | 
| javascriptproptypes | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>javascript-prop-types</code> | 
| kotlin | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>kotlin</code> | 
| pike | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>pike</code> | 
| python | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>python</code> | 
| rust | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>rust</code> | 
| ruby | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>ruby</code> | 
| swift | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>swift</code> | 
| typescript | [<code>SupportedLanguages</code>](#SupportedLanguages) | <code>typescript</code> | 

<a name="quicktypeSchema"></a>

## quicktypeSchema(schemaPath, schemaName, jsonSchema)
Generate a typescript structure from a schema.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| schemaPath | <code>String</code> | Path to the folder to store the generated files |
| schemaName | <code>\*</code> | The name of the schema to generate |
| jsonSchema | <code>\*</code> | The schema to generate |

<a name="generateAllMessagePayloads"></a>

## generateAllMessagePayloads(generatorTargetDir, parameters, messages)
**Kind**: global function  

| Param | Type |
| --- | --- |
| generatorTargetDir | <code>string</code> | 
| parameters | [<code>Parameters</code>](#Parameters) | 
| messages | <code>\*</code> | 

<a name="SupportedLanguages"></a>

## SupportedLanguages : <code>string</code>
**Kind**: global typedef  
<a name="Parameters"></a>

## Parameters : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| subTargetDir | <code>string</code> | which relative target sub directory should it be rendered to. It is relative to where the generators targetDir |
| rendererOptions | <code>string</code> | Provide a JSON object as a string which should be parsed to quicktype. |
| quicktypeLanguage | [<code>SupportedLanguages</code>](#SupportedLanguages) | Which type of language should be generated. |

