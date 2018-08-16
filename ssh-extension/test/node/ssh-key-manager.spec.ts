/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { deepEqual, instance, mock, verify, when } from 'ts-mockito';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import 'reflect-metadata';
import { SshKeyServiceClient, SshKeyServiceHttpClient } from '../../src/node/ssh-key-service-client'
import { SshKeyPair } from '../../src/common/ssh-protocol';
import { RemoteSshKeyManager, SshKeyManager } from '../../src/node/ssh-key-manager';

chai.use(chaiAsPromised);
chai.should();

describe("Testing SSH key manager (SshKeyManager)...", () => {
    let sshKeyServiceClient: SshKeyServiceClient = mock(SshKeyServiceHttpClient);
    let sshKeyManager: SshKeyManager = new RemoteSshKeyManager(instance(sshKeyServiceClient));

    let service: string = 'service';
    let name: string = 'name';
    let sshKeyPair: SshKeyPair = { service: service, name: name, privateKey: '', publicKey: '' };
    let error: Error = { name: '', message: '' };

    context("Generating of an SSH key pair", () => {
        it("is delegated to an SSH key service client (SshKeyServiceClient) one time", () => {
            when(sshKeyServiceClient.generate(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            sshKeyManager.generate(service, name);

            return verify(sshKeyServiceClient.generate(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyServiceClient.generate(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            return sshKeyManager.generate(service, name).should.eventually.be.equal(sshKeyPair);
        });
        it("returns a promise rejected with a proper error for failed calls", () => {
            when(sshKeyServiceClient.generate(deepEqual(service), deepEqual(name))).thenReject(error);

            return sshKeyManager.generate(service, name).should.eventually.be.rejectedWith(error);
        });
    });

    context("Creating of an SSH key pair", () => {
        it("is delegated to an SSH key service client (SshKeyServiceClient) one time", () => {
            when(sshKeyServiceClient.create(deepEqual(sshKeyPair))).thenResolve(null);

            sshKeyManager.create(sshKeyPair);

            return verify(sshKeyServiceClient.create(deepEqual(sshKeyPair))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyServiceClient.create(deepEqual(sshKeyPair))).thenResolve(null);

            return sshKeyManager.create(sshKeyPair).should.eventually.be.fulfilled;
        });
        it("returns a promise rejected with a proper error for failed calls", () => {
            when(sshKeyServiceClient.create(deepEqual(sshKeyPair))).thenReject(error);

            return sshKeyManager.create(sshKeyPair).should.eventually.be.rejectedWith(error);
        });
    });

    context("Getting of multiple SSH key pairs", () => {
        let sshKeyPairs = [sshKeyPair];

        it("is delegated to an SSH key service client (SshKeyServiceClient) one time", () => {
            when(sshKeyServiceClient.getAll(deepEqual(service))).thenResolve(sshKeyPairs);

            sshKeyManager.getAll(service);

            return verify(sshKeyServiceClient.getAll(deepEqual(service))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyServiceClient.getAll(deepEqual(service))).thenResolve(sshKeyPairs);

            return sshKeyManager.getAll(service).should.eventually.be.equal(sshKeyPairs);
        });
        it("returns a promise rejected with a proper error for failed calls", () => {
            when(sshKeyServiceClient.getAll(deepEqual(service))).thenReject(error);

            return sshKeyManager.getAll(service).should.eventually.be.rejectedWith(error);
        });
    });

    context("Getting of a single SSH key pair", () => {
        it("is delegated to an SSH key service client (SshKeyServiceClient) one time", () => {
            when(sshKeyServiceClient.get(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            sshKeyManager.get(service, name);

            return verify(sshKeyServiceClient.get(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyServiceClient.get(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            return sshKeyManager.get(service, name).should.eventually.be.equal(sshKeyPair);
        });
        it("returns a promise rejected with a proper error for failed calls", () => {
            when(sshKeyServiceClient.get(deepEqual(service), deepEqual(name))).thenReject(error);

            return sshKeyManager.get(service, name).should.eventually.be.rejectedWith(error);
        });
    });

    context("Deleting of an SSH key pair", () => {
        it("is delegated to an SSH key service client (SshKeyServiceClient) one time", () => {
            when(sshKeyServiceClient.delete(deepEqual(service), deepEqual(name))).thenResolve(null);

            sshKeyManager.delete(service, name);

            return verify(sshKeyServiceClient.delete(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyServiceClient.delete(deepEqual(service), deepEqual(name))).thenResolve(null);

            return sshKeyManager.delete(service, name).should.eventually.be.fulfilled;
        });
        it("returns a promise rejected with a proper error for failed calls", () => {
            when(sshKeyServiceClient.delete(deepEqual(service), deepEqual(name))).thenReject(error);

            return sshKeyManager.delete(service, name).should.eventually.be.rejectedWith(error);
        });
    });
});
