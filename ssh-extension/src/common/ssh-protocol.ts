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

export const sshKeyServicePath = '/services/ssh-key';
export const SshKeyServer = Symbol("SshKeyServer");

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
