/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

/**
 * Representation of JSON-RPC service for SSH key pair management.
 */
export interface SshKeyServer {

    generate(service: string, name: string): Promise<SshKeyPair>;

    create(sshKeyPair: SshKeyPair): Promise<void>;

    get(service: string, name: string): Promise<SshKeyPair>;

    getAll(service: string): Promise<SshKeyPair[]>;

    delete(service: string, name: string): Promise<void>;
}

export interface CheService {
    name: string,
    displayName: string,
    description: string
}

/**
 * Representation of a SSH key pair.
 */
export interface SshKeyPair {
    /**
     * Che service that uses SSH key pair, e.g. workspace, machine, vcs.
     */
    service: string;
    /**
     * Key pair identifier.
     */
    name: string;
    privateKey?: string;
    publicKey?: string;
}
