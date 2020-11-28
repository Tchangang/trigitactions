#Trigitactions

⭐ Star us on GitHub — it helps!
Trigitactions is a cli to trigger github actions from terminal, npm / yarn script with just one line.

It uses @ocktokit under the hood and can be launched in 1 min.

## Installation

```javascript
npm i -g trigitactions
yarn add -g trigitactions
```
One installed you have 3 commands:
- trigit: help menu for trigitactions cli
- runworkflow: Run a workflow on github actions
- listworflow: List for a given repository all worklow.id, worklow.name and worklow.filename

##Commands
###Auth
To interact with Github api, you need to setup an env variable with a github token value.
You can generate a token there: https://github.com/settings/tokens

###listworkflow
This command helps you to list all workflow in a repository.
````javascript
listworkflow -o Owner -r Repository -p Profile -q search_term
````
Owner and Repository are required.

Profile is not required, but you need to setup an env variable named TRIGIT_DEFAULT_PROFILE with a valid github token.
If your already have an env variable with a valid github token value, just use:
```javascript
-p YOUR_ENV_VARIABLE_NAME
```

If you are looking for a particular workflow, you can use the -q parameter. It's a simple filter as workflow.name.toLowerCase().includes(q).

Example
````javascript
listworkflow -o JohnDoe -r FirstCorp
----------------------------------------
Output:
Owner: JohnDoe | Repo: FirstCorp
Workflow found: 3
id: 1637264 | name: Build/company1 | filename: buildcompany1.yml
id: 6173621 | name: Build/company2 | filename: buildcompany2.yml
````

###runworkflow
This command helps you to trigger a github action.
````javascript
runworkflow  -o Owner -r Repository -w WorkflowId -i 'DataForJob:JSON' -f master
````
Owner and Repository are required.
This command uses the same config for -p variable as listworfklow command.

-w variable is the workflow id to trigger. You can use workflow.name or wrkflow.filename given in listworfklow command.

-i variable is for workflow input. To use this parameters, you need to define input in your .yml file, otherwise an error will be throw.
Data should be passed as a JSON string: ```-i '{"url": "http://example"}'```

-f is for ref. By default this will be set to master, you can use any branch or tag name.
 
 ````javascript
 runworkflow -o JohnDoe -r company1 -w 6176732 -i '{"dbUrl": "mydb.com"}' -f dev
 ----------------------------------------
 Output:
 Status: 204. Action triggered 👍
 ````
