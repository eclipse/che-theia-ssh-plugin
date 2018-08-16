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
import { SshKeyServiceHttpClient } from '../../src/node/ssh-key-service-client'
import { WsMasterHttpClient } from '../../src/node/ws-master-http-client';
import { SshKeyPair } from '../../src/common/ssh-protocol';
import { AxiosError, AxiosResponse } from 'axios';

chai.use(chaiAsPromised);
chai.should();

describe("Testing SSH key service client (SshKeyServiceHttpClient)...", () => {
    let wsMasterClient: WsMasterHttpClient = mock(WsMasterHttpClient);
    let sshKeyServiceClient: SshKeyServiceHttpClient = new SshKeyServiceHttpClient(instance(wsMasterClient));


    let service: string = 'service';
    let name: string = 'name';
    let sshKeyPair: SshKeyPair = { service: 'service', name: 'name', privateKey: '', publicKey: '' };
    let response: AxiosResponse = { data: sshKeyPair, status: 0, statusText: '', headers: '', config: {} };
    let error: AxiosError = { response: response, config: {}, name: '', message: '' };

    context("Generating of an SSH key pair", () => {
        it("is delegated to an inner HTTP client (WsMasterHttpClient) that calls POST method once", () => {
            when(wsMasterClient.post(deepEqual('/ssh/generate'), deepEqual({ service, name }))).thenResolve(response);

            sshKeyServiceClient.generate(service, name);

            return verify(wsMasterClient.post(deepEqual('/ssh/generate'), deepEqual({ service, name }))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(wsMasterClient.post(deepEqual('/ssh/generate'), deepEqual({ service, name }))).thenResolve(response);

            return sshKeyServiceClient.generate(service, name).should.eventually.be.equal(response.data);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(wsMasterClient.post(deepEqual('/ssh/generate'), deepEqual({ service, name }))).thenReject(error);

            return sshKeyServiceClient.generate(service, name).should.eventually.be.rejectedWith(error.response.data);
        });
    });

    context("Creating of an SSH key pair", () => {
        it("is delegated to an inner HTTP client (WsMasterHttpClient) that calls POST method once", () => {
            when(wsMasterClient.post(deepEqual('/ssh'), deepEqual(sshKeyPair))).thenResolve(null);

            sshKeyServiceClient.create(sshKeyPair);

            return verify(wsMasterClient.post(deepEqual('/ssh'), deepEqual(sshKeyPair))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(wsMasterClient.post(deepEqual('/ssh'), deepEqual(sshKeyPair))).thenResolve(null);

            return sshKeyServiceClient.create(sshKeyPair).should.eventually.be.fulfilled;
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(wsMasterClient.post(deepEqual('/ssh'), deepEqual(sshKeyPair))).thenReject(error);

            return sshKeyServiceClient.create(sshKeyPair).should.eventually.be.rejectedWith(error);
        });
    });

    context("Getting of a several SSH key pairs", () => {
        it("is delegated to an inner HTTP client (WsMasterHttpClient) that calls GET method once", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}`))).thenResolve(response);

            sshKeyServiceClient.getAll(service);

            return verify(wsMasterClient.get(deepEqual(`/ssh/${service}`))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}`))).thenResolve(response);

            return sshKeyServiceClient.getAll(service).should.eventually.be.deep.equal(response.data);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}`))).thenReject(error);

            return sshKeyServiceClient.getAll(service).should.eventually.be.rejectedWith(error.response.data);
        });
    });

    context("Getting of a single SSH key pair", () => {
        it("is delegated to an inner HTTP client (WsMasterHttpClient) that calls GET method once", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}/find?name=${name}`))).thenResolve(response);

            sshKeyServiceClient.get(service, name);

            return verify(wsMasterClient.get(deepEqual(`/ssh/${service}/find?name=${name}`))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}/find?name=${name}`))).thenResolve(response);

            return sshKeyServiceClient.get(service, name).should.eventually.be.deep.equal(response.data);
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(wsMasterClient.get(deepEqual(`/ssh/${service}/find?name=${name}`))).thenReject(error);

            return sshKeyServiceClient.get(service, name).should.eventually.be.rejectedWith(error.response.data);
        });
    });

    context("Deleting of an SSH key pair", () => {
        it("is delegated to an inner HTTP client (WsMasterHttpClient) that calls GET method once", () => {
            when(wsMasterClient.delete(deepEqual(`/ssh/${service}?name=${name}`))).thenResolve(null);

            sshKeyServiceClient.delete(service, name);

            return verify(wsMasterClient.delete(deepEqual(`/ssh/${service}?name=${name}`))).once();
        });
        it("returns a promise with a corresponding data for successful calls", () => {
            when(wsMasterClient.delete(deepEqual(`/ssh/${service}?name=${name}`))).thenResolve(null);

            return sshKeyServiceClient.delete(service, name).should.eventually.be.fulfilled;
        });
        it("returns a rejected promise with a proper error for failed calls", () => {
            when(wsMasterClient.delete(deepEqual(`/ssh/${service}?name=${name}`))).thenReject(error);

            return sshKeyServiceClient.delete(service, name).should.eventually.be.rejectedWith(error);
        });
    });
});
