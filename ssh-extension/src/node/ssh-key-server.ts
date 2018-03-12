/*
 * Copyright (c) 2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { inject, injectable } from 'inversify';
import { SshKeyPair, SshKeyServer } from '../common/ssh-protocol';
import { SshKeyManager } from './ssh-key-manager';

/**
 * Server implementation of SSH key pair API
 */
@injectable()
export class SshKeyServerImpl implements SshKeyServer {

    constructor(@inject(SshKeyManager) protected readonly sshKeyManager: SshKeyManager) {
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
