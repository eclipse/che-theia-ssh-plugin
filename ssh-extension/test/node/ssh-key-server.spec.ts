/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { anyString, anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import 'reflect-metadata';
import { SshKeyPair, SshKeyServer } from '../../src/common/ssh-protocol';
import { RemoteSshKeyManager, SshKeyManager } from '../../src/node/ssh-key-manager';
import { SshKeyServerImpl } from '../../src/node/ssh-key-server';

chai.use(chaiAsPromised);
chai.should();

describe("Testing SSH key server (SshKeyServer)...", () => {
    let sshKeyManager: SshKeyManager = mock(RemoteSshKeyManager);
    let sshKeyServer: SshKeyServer = new SshKeyServerImpl(instance(sshKeyManager));

    let service: string = 'service';
    let name: string = 'name';
    let sshKeyPair: SshKeyPair = { service: service, name: name, privateKey: '', publicKey: '' };
    let error: Error = { name: '', message: '' };

    context("Generating of an SSH key pair", () => {
        it("is delegated to an SSH key manager (SshKeyManager) one time", () => {
            when(sshKeyManager.generate(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            sshKeyServer.generate(service, name);

            return verify(sshKeyManager.generate(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyManager.generate(anyString(), anything())).thenResolve(sshKeyPair);

            return sshKeyServer.generate(service, name).should.eventually.be.equal(sshKeyPair);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(sshKeyManager.generate(anyString(), anything())).thenReject(error);

            return sshKeyServer.generate(service, name).should.eventually.be.rejectedWith(error);
        });
    });

    context("Creating of an SSH key pair", () => {
        it("is delegated to an SSH key manager (SshKeyManager) once", () => {
            when(sshKeyManager.create(deepEqual(sshKeyPair))).thenResolve(null);

            sshKeyServer.create(sshKeyPair);

            return verify(sshKeyManager.create(deepEqual(sshKeyPair))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyManager.create(deepEqual(sshKeyPair))).thenResolve(null);

            return sshKeyServer.create(sshKeyPair).should.eventually.be.fulfilled;
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(sshKeyManager.create(deepEqual(sshKeyPair))).thenReject(error);

            return sshKeyServer.create(sshKeyPair).should.eventually.be.rejectedWith(error);
        });
    });

    context("Getting of multiple SSH key pairs", () => {
        let sshKeyPairs = [sshKeyPair];

        it("is delegated to an SSH key manager (SshKeyManager) once", () => {
            when(sshKeyManager.getAll(deepEqual(service))).thenResolve(sshKeyPairs);

            sshKeyServer.getAll(service);

            return verify(sshKeyManager.getAll(deepEqual(service))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyManager.getAll(deepEqual(service))).thenResolve(sshKeyPairs);

            return sshKeyServer.getAll(service).should.eventually.be.equal(sshKeyPairs);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(sshKeyManager.getAll(deepEqual(service))).thenReject(error);

            return sshKeyServer.getAll(service).should.eventually.be.rejectedWith(error);
        });
    });

    context("Getting of a single SSH key pairs", () => {
        it("is delegated to an SSH key manager (SshKeyManager) once", () => {
            when(sshKeyManager.get(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            sshKeyServer.get(service, name);

            return verify(sshKeyManager.get(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyManager.get(deepEqual(service), deepEqual(name))).thenResolve(sshKeyPair);

            return sshKeyServer.get(service, name).should.eventually.be.equal(sshKeyPair);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(sshKeyManager.get(deepEqual(service), deepEqual(name))).thenReject(error);

            return sshKeyServer.get(service, name).should.eventually.be.rejectedWith(error);
        });
    });

    context("Deleting of an SSH key pair", () => {
        it("is delegated to an SSH key manager (SshKeyManager) once", () => {
            when(sshKeyManager.delete(deepEqual(service), deepEqual(name))).thenResolve(null);

            sshKeyServer.delete(service, name);

            return verify(sshKeyManager.delete(deepEqual(service), deepEqual(name))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(sshKeyManager.delete(deepEqual(service), deepEqual(name))).thenResolve(null);

            return sshKeyServer.delete(service, name).should.eventually.be.fulfilled;
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(sshKeyManager.delete(deepEqual(service), deepEqual(name))).thenReject(error);

            return sshKeyServer.delete(service, name).should.eventually.be.rejectedWith(error);
        });
    });
});
