import arg from 'arg';
import { Octokit } from '@octokit/core';
import colors from 'colors';

export function cli(args) {
    console.log(`
To trigger git actions, use the following command: 
    run -o Owner -r Repository -w WorkflowId or Workflow file name -i '{JSON string for your worklow event}' -p Profile
    * Owner, Repository and WorkflowId are required
    * If you omit profile, you need to have an env variable named TRIGIT_DEFAULT_PROFILE. if you set profile you need to have an env variable named like your profile value.
    
Sometimes you don't know your worfklow id.
You can list all workflow for a repo. Use the following command:
    run -o Owner -r Repository -p Profile -q searchTerm
    * Owner, Repository are required
    * You can filter workflow with -q. It use a simple filter as workflow.name.toLowerCase().includes(q)
    * Remember you can use workflow id or workflow file name as input parameter for -w (--workflow_id)
`)
}