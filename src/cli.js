import arg from 'arg';
import { Octokit } from '@octokit/core';
import colors from 'colors';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--owner': String,
            '--repo': String,
            '--workflow_id': String,
            '--profil': String,
            '--ref': String,
            '--input': String,
            '-o': '--owner',
            '-r': '--repo',
            '-w': '--workflow_id',
            '-p': '--profil',
            '-f': '--ref',
            '-i': '--input',
        },
        {
            argv: rawArgs.slice(1),
        }
    );
    return {
        owner: args['--owner'],
        repo: args['--repo'],
        workflowId: args['--workflow_id'],
        ref: args['--ref'] || 'master',
        input: args['--input'],
        profile: args['--profil'] || 'TRIGIT_DEFAULT_PROFILE',
    };
}


export function cli(args) {
    const options = parseArgumentsIntoOptions(args);
    if (!options.owner) {
        console.log('Missing owner repo. Use --owner xxx or -o xxx'.red);
        return;
    }
    if (!options.repo) {
        console.log('Missing repository name. Use --repo xxx or -r xxx'.red);
        return;
    }
    if (!options.workflowId) {
        console.log('Missing workflow id or workflow filename. Use --workflow_id xxx or -w xxx'.red);
        return;
    }
    const authToken = process.env[options.profile];
    if (!authToken) {
        console.log(`Profile ${options.profile} not found. Be sure to create an env variable with name ${options.profile}.`.red);
        return;
    }
    const octokit = new Octokit({ auth: authToken });
    const config = {
        owner: options.owner,
        repo: options.repo,
        workflow_id: options.workflowId,
        ref: options.ref,
    };
    if (options.input) {
        try {
            config.input = JSON.parse(options.input);
        } catch (e) {
            delete config.input;
        }
    }
    octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', config)
        .then((res) => {
            console.log(`Status: ${res.status}. Action triggered 👍`.green);
        })
        .catch((e) => {
            if (e.status === 404) {
                console.log('Resource not found'.red);
                return;
            }
            console.log('Error'.red,'\n', `Status: ${e.status}`.red, '\n',`Message: ${e.message}`.red);
        });
}