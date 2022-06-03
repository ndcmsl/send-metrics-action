import fetch from 'node-fetch';
import { getInput, setFailed } from '@actions/core';

const host: string = getInput('host');
const value: string = getInput('value');
const dev: string = getInput('dev');
const infra: string = getInput('infra');
const microservice: string = getInput('microservice');
const version: string = getInput('version');
const config: string = getInput('config');
const mode: string = getInput('mode');
const timestamp: string = new Date().toISOString();

async function sendMetrics(): Promise<any> {

    const modes = {
        setup: {
            tags: {
                dev,
                infra,
                microservice
            }
        },
        deploy: {
            tags: {
                dev,
                infra,
                microservice,
                version,
                config
            }
        },
        rollback: {
            tags: {
                dev,
                infra,
                microservice,
                version
            }
        }
    };

    const body = {
        metrics: [
            {
                name: `${mode}_metric`,
                timestamp,
                value,
                tags: modes[mode].tags
            }
        ]
    };

    const response = await fetch(`http://${host}/Api/PushGateway/SetMetrics`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    });

    return response.json();
}

async function main() {
    await sendMetrics();
}

try {
    main()
} catch (error) {
    setFailed(error);
}