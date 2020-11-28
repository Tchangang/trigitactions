import arg from 'arg';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--owner': String,
            '--repo': String,
            '--workflow_id': String,
            '--profil': String,
            '-o': '--owner',
            '-r': '--repo',
            '-w': '--workflow_id',
            '-p': '--profil',
        },
        {
            argv: rawArgs.slice(1),
        }
    );
    return {
        owner: args['--owner'],
        repo: args['--repo'],
        workflowId: args['workflow_id'],
        profile: args['--profil'] || 'TRIGIT_DEFAULT_PROFILE',
    };
}

export function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
}