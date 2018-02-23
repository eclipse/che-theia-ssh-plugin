/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { injectable } from 'inversify';
import { SshKeyServer, SshKeyPair } from '../common/ssh-protocol';

/**
 * Fake implementation for testing frontend purposes.
 */
@injectable()
export class FakeSshKeyServer implements SshKeyServer {

    protected readonly keyPairs: Map<string, SshKeyPair> = new Map();

    constructor() {
        [
            { service: 'workspace', name: 'ws-id', privateKey: 'private key content', publicKey: 'public key content' },
            { service: 'machine', name: 'ws-agent machine', privateKey: 'private key content', publicKey: 'public key content' },
            { service: 'machine', name: 'db machine', privateKey: 'private key content', publicKey: 'public key content' },
            { service: 'vcs', name: 'github.com', privateKey: 'private key content', publicKey: 'public key content' },
            { service: 'vcs', name: 'gitlab.com', privateKey: 'private key content', publicKey: 'public key content' }
        ].forEach(keyPair => {
            this.keyPairs.set(`${keyPair.service}/${keyPair.name}`, keyPair);
        });
    }

    generate(service: string, name: string): Promise<SshKeyPair> {
        const keyPair = {
            service: service,
            name: name,
            privateKey: 'private key content',
            publicKey: 'public key content'
        }
        this.keyPairs.set(`${service}/${name}`, keyPair);
        return Promise.resolve(keyPair);
    }

    list(service: string, name?: string): Promise<SshKeyPair[]> {
        const filteredKeys = [];
        for (const keyPair of this.keyPairs.values()) {
            if (keyPair.service !== service) {
                continue;
            }
            if (name && keyPair.name !== name) {
                continue;
            }
            filteredKeys.push(keyPair);
        }
        return Promise.resolve(filteredKeys);
    }

    delete(service: string, name: string): Promise<void> {
        this.keyPairs.delete(`${service}/${name}`);
        return Promise.resolve();
    }
}
