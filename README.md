# perfecto-cypress-sdk
Run Cypress tests in Perfecto cloud

## 🔗 [Documentation][perfecto_cypress_doc]

## Install
```shell
npm i perfecto-cypress-sdk
```

## Usage
💡 in Windows you may need to add `npx` before any SDK commands in the command-line
This package  expose CLI interface try this
```shell
$ perfecto-cypress --help

perfecto-cypress <command>

Commands:
  perfecto-cypress init    init Perfecto and Cypress configuration files
  perfecto-cypress pack    Zip tests files according to configurations
  perfecto-cypress run     Run Cypress tests on Perfecto cloud
  perfecto-cypress upload  Upload tests zip archive to Perfecto cloud repository

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

```
It  also exposed aan api to use programmatically from JavaScript  code
```ecmascript 6
import perfectoCypress from 'perfecto-cypress-sdk';

perfectoCypress.run({...});
```

### Init command
```shell
perfecto-cypress init --tests.path=./tests
```
`Init` command will create [perfecto-config.json][perfecto_cypress_doc_config] file.

💡 This is the time to follow the instruction [here][perfecto_cypress_reporter]. This step is important to allow us creating the execution report.

###  Run command
```shell
perfecto-cypress run --credentials.securityToken=******
```
`Run` command will an archive zip file with tests package (Cypress tests code, and the configuration files)
Run command will save this archive  in the client Perfecto repository and start  execute the tests in parallel inside Perfecto cloud environment.

💡 Yo may override all config options from CLI/API interface except `capabilities`. Also it is not recommended to store securityToken in the `perfecto-config.json` file. 

### Pac and Upload commands
if you want to create the archive and use it later, for example if you have tests that running  periodically.
you can create the archive:
```shell
perfecto-cypress pack
perfecto-cypress upload --folderType=PUBLIC --temporary=false
```
copy the artifact id from the `upload` command output. for  example: `PUBLIC:perfecto-cypress.zip`
Now you  can any time cal `run` command:
```shell
perfecto-cypress run --tests.artifactKey=PUBLIC:perfecto-cypress.zip
```
it will skip the `pack` and `upload` steps and just execute the tests stored in the provided archive.

[perfecto_cypress_reporter]: https://www.npmjs.com/package/perfecto-cypress-reporter
[perfecto_cypress_doc_config]: https://developers.perfectomobile.com/display/PD/Cypress#Cypress-perfecto-config.jsonPerfecto-config.json
[cypress_doc_config]: https://docs.cypress.io/guides/references/configuration.html
[perfecto_cypress_doc]: https://developers.perfectomobile.com/display/PD/Cypress
