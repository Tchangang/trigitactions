import arg from 'arg';
import { Octokit } from '@octokit/core';
import colors from 'colors';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--owner': String,
            '--repo': String,
            '--profil': String,
            '--q': String,
            '-o': '--owner',
            '-r': '--repo',
            '-p': '--profil',
            '-q': '--q',
        },
        {
            argv: rawArgs.slice(1),
        }
    );
    return {
        owner: args['--owner'],
        repo: args['--repo'],
        profile: args['--profil'] || 'TRIGIT_DEFAULT_PROFILE',
        q: args['--q'],
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
    const authToken = process.env[options.profile];
    if (!authToken) {
        console.log(`Profile ${options.profile} not found. Be sure to create an env variable with name ${options.profile}.`.red);
        return;
    }
    const octokit = new Octokit({ auth: authToken });
    const config = {
        owner: options.owner,
        repo: options.repo,
    };
    octokit.request('GET /repos/{owner}/{repo}/actions/workflows', config)
        .then((res) => {
            console.log(`Owner: ${options.owner} | Repo: ${options.repo}`.green);
            console.log(`Workflow found: ${res.data.total_count}`);
            res.data.workflows.filter((workflow) => (!options.q || (options.q && workflow.name.toLowerCase().includes(options.q)))).forEach((workflow) => {
                console.log(`id: ${workflow.id} | name: ${workflow.name} | filename: ${workflow.path.split('/').pop()}`);
            });
            if (res.data.workflows.length > 0) {
                console.log('\nYou can use id or filename as worfkow_id parameters'.green);
            }
        })
        .catch((e) => {
            if (e.status === 404) {
                console.log('Resource not found'.red);
                return;
            }
            console.log('Error'.red,'\n', `Status: ${e.status}`.red, '\n',`Message: ${e.message}`.red);
        });
}