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
import { WsMasterHttpClient } from './ws-master-http-client';

/**
 * SSH key service client API definition. SSH key service is currently located
 * on Che workspace master instance and available for REST requests. The one
 * actual implementation of this interface uses HTTP protocol to reach out the
 * service and perform SSH key API manipulations, however it is quite possible
 * that in future there will be a necessity in another kind of client (e.g.
 * JSON-RPC based).
 *
 * @see <a href=https://github.com/eclipse/che/blob/6.1.1/wsmaster/che-core-api-ssh/src/main/java/org/eclipse/che/api/ssh/server/SshService.java>SshService</a>
 *
 */
export interface SshKeyServiceClient {

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
    create(sshKeyPair: SshKeyPair): Promise<void>

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
 * HTTP based implementation of {@link SshKeyServiceClient}. In fact it is a
 * plain wrapper around {@link WsMasterHttpClient} library that does SSH
 * service specific REST calls and process responses correspondingly (in
 * accordance to their HTTP statuses).
 */
export class SshKeyServiceHttpClient implements SshKeyServiceClient {
    constructor(protected readonly wsMasterHttpClient: WsMasterHttpClient) {
    }

    /**
     * @inheritDoc
     */
    generate(service: string, name: string): Promise<SshKeyPair> {
        return new Promise<SshKeyPair>((resolve, reject) => {
            this.wsMasterHttpClient
                .post<SshKeyPair>('/ssh/generate', { service, name })
                .then(value => resolve(value.data))
                .catch(reason => reject(reason!.response.data));
        });
    }

    /**
     * @inheritDoc
     */
    create(sshKeyPair: SshKeyPair): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.wsMasterHttpClient
                .post('/ssh', sshKeyPair)
                .then(() => resolve())
                .catch(reason => reject(reason!.response.data));
        });
    }

    /**
     * @inheritDoc
     */
    getAll(service: string): Promise<SshKeyPair[]> {
        return new Promise<SshKeyPair[]>((resolve, reject) => {
            this.wsMasterHttpClient
                .get<SshKeyPair[]>(`/ssh/${service}`)
                .then(value => resolve(value.data))
                .catch(reason => reject(reason!.response.data));
        });
    }

    /**
     * @inheritDoc
     */
    get(service: string, name: string): Promise<SshKeyPair> {
        return new Promise<SshKeyPair>((resolve, reject) => {
            this.wsMasterHttpClient
                .get<SshKeyPair>(`/ssh/${service}/find?name=${name}`)
                .then(value => resolve(value.data))
                .catch(reason => reject(reason!.response.data));
        });
    }

    /**
     * @inheritDoc
     */
    delete(service: string, name: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.wsMasterHttpClient
                .delete(`/ssh/${service}?name=${name}`)
                .then(() => resolve())
                .catch(reason => reject(reason!.response.data));
        });
    }
}
