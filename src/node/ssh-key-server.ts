/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { SshKeyPair, SshKeyServer } from '../common/ssh-protocol';
import { SshKeyManager } from './ssh-key-manager';

/**
 * Server implementation of SSH key pair API
 */
export class SshKeyServerImpl implements SshKeyServer {

    constructor(protected readonly sshKeyManager: SshKeyManager) {
    }

    /**
     * @inheritDoc
     */
    generate(service: string, name: string): Promise<SshKeyPair> {
        return this.sshKeyManager.generate(service, name);
    }

    /**
     * @inheritDoc
     */
    create(sshKeyPair: SshKeyPair): Promise<void> {
        return this.sshKeyManager.create(sshKeyPair);
    }

    /**
     * @inheritDoc
     */
    get(service: string, name: string): Promise<SshKeyPair> {
        return this.sshKeyManager.get(service, name);
    }

    /**
     * @inheritDoc
     */
    getAll(service: string): Promise<SshKeyPair[]> {
        return this.sshKeyManager.getAll(service);
    }

    /**
     * @inheritDoc
     */
    delete(service: string, name: string): Promise<void> {
        return this.sshKeyManager.delete(service, name);
    }
}
