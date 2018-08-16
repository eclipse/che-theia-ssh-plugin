/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { SshKeyPair, SshKeyServer } from '../../common/ssh-protocol';
import { injectable } from 'inversify';

@injectable()
export class FakeSshKeyServer implements SshKeyServer {

    generate(service: string, name: string): Promise<SshKeyPair> {
        return Promise.reject('');
    }

    create(sshKeyPair: SshKeyPair): Promise<void> {
        return Promise.reject('');
    }

    get(service: string, name: string): Promise<SshKeyPair> {
        return Promise.reject('');
    }

    getAll(service: string): Promise<SshKeyPair[]> {
        return Promise.resolve([]);
    }

    delete(service: string, name: string): Promise<void> {
        return Promise.resolve();
    }
}
