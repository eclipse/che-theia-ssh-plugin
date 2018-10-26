/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { SshKeyPair } from '../common/ssh-protocol';
import { SshKeyServiceClient } from './ssh-key-service-client';

/**
 * Simple SSH key pairs manager that performs basic operations like create,
 * get, delete, etc. There is no restriction on the way the keys are obtained -
 * remotely (via REST or JSON-RPC, ) or locally (e.g. dynamically generated
 * and/or in-memory stored), so the implementation of the interface defines
 * the mechanism that is used.
 */
export interface SshKeyManager {

    /**
     * Generate an SSH key pair for specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<SshKeyPair>}
     */
    generate(service: string, name: string): Promise<SshKeyPair>;

    /**
     * Create a specified SSH key pair
     *
     * @param {SshKeyPair} sshKeyPair the SSH key pair that is to be created
     *
     * @returns {Promise<void>}
     */
    create(sshKeyPair: SshKeyPair): Promise<void>;

    /**
     * Get all SSH key pairs associated with specified service
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     *
     * @returns {Promise<SshKeyPair[]>}
     */
    getAll(service: string): Promise<SshKeyPair[]>;

    /**
     * Get an SSH key pair associated with specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<SshKeyPair>}
     */
    get(service: string, name: string): Promise<SshKeyPair>;

    /**
     * Delete an SSH key pair with a specified service and name
     *
     * @param {string} service the name of the service that is associated with
     * the SSH key pair
     * @param {string} name the identifier of the key pair
     *
     * @returns {Promise<void>}
     */
    delete(service: string, name: string): Promise<void>;
}

/**
 * A remote SSH key paris manager that uses {@link SshKeyServiceClient} for
 * all SHH key related operations.
 */
export class RemoteSshKeyManager implements SshKeyManager {

    constructor(protected readonly sshKeyServiceClient: SshKeyServiceClient) {
    }

    /**
     * @inheritDoc
     */
    generate(service: string, name: string): Promise<SshKeyPair> {
        return new Promise<SshKeyPair>((resolve, reject) => {
            this.sshKeyServiceClient
                .generate(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason));
        });
    }

    /**
     * @inheritDoc
     */
    create(sshKeyPair: SshKeyPair): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.sshKeyServiceClient
                .create(sshKeyPair)
                .then(value => resolve(value))
                .catch(reason => reject(reason));
        });
    }

    /**
     * @inheritDoc
     */
    getAll(service: string): Promise<SshKeyPair[]> {
        return new Promise<SshKeyPair[]>((resolve, reject) =>
            this.sshKeyServiceClient
                .getAll(service)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }

    /**
     * @inheritDoc
     */
    get(service: string, name: string): Promise<SshKeyPair> {
        return new Promise<SshKeyPair>((resolve, reject) =>
            this.sshKeyServiceClient
                .get(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }

    /**
     * @inheritDoc
     */
    delete(service: string, name: string): Promise<void> {
        return new Promise<void>((resolve, reject) =>
            this.sshKeyServiceClient
                .delete(service, name)
                .then(value => resolve(value))
                .catch(reason => reject(reason)));
    }
}
