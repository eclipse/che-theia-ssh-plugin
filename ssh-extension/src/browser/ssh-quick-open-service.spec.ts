/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { enableJSDOM } from '@theia/core/lib/browser/test/jsdom';

let disableJSDOM = enableJSDOM();

import * as assert from 'assert';
import 'mocha';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import { Container } from 'inversify';
import { MessageService, MessageClient, ILogger } from '@theia/core';
import { QuickOpenMode } from '@theia/core/lib/browser';
import { QuickOpenService } from '@theia/core/lib/browser/quick-open/';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { MockLogger } from '@theia/core/lib/common/test/mock-logger';
import { MockWindowService } from '@theia/core/lib/browser/window/test/mock-window-service';
import { ClipboardService } from './clipboard-service';
import { SshQuickOpenService } from './ssh-quick-open-service';
import { FakeSshKeyServer } from './test/fake-ssh-key-server';
import { SshKeyServer, SshKeyPair } from '../common/ssh-protocol';

disableJSDOM();

let testContainer: Container;
let service: SshQuickOpenService;

before(() => {
    testContainer = new Container();
    testContainer.bind(SshKeyServer).to(FakeSshKeyServer).inSingletonScope();
    testContainer.bind(MessageService).toSelf().inSingletonScope();
    testContainer.bind(MessageClient).toSelf();
    testContainer.bind(ILogger).to(MockLogger);
    testContainer.bind(QuickOpenService).toSelf().inSingletonScope();
    testContainer.bind(ClipboardService).toSelf().inSingletonScope();
    testContainer.bind(WindowService).to(MockWindowService);
    testContainer.bind(SshQuickOpenService).toSelf().inSingletonScope();
});

describe('ssh-quick-open-service', function () {

    before(() => {
        disableJSDOM = enableJSDOM();
    });

    after(() => {
        disableJSDOM();
    });

    beforeEach(() => {
        service = testContainer.get(SshQuickOpenService);
    });

    describe('Generating key pair', () => {
        it('Should call open service', () => {
            const quickOpenService = testContainer.get(QuickOpenService);
            const quickOpenServiceSpy = sinon.spy(quickOpenService, 'open');

            service.generateKeyPair();

            assert(quickOpenServiceSpy.called);

            quickOpenServiceSpy.restore();
        });
    });

    describe('Creating key pair', () => {
        it('Should call open service', () => {
            const quickOpenService = testContainer.get(QuickOpenService);
            const quickOpenServiceSpy = sinon.spy(quickOpenService, 'open');

            service.createKeyPair();

            assert(quickOpenServiceSpy.called);

            quickOpenServiceSpy.restore();
        });
    });

    describe('Copying public key', () => {
        it('Should copy a public key', async () => {
            const allKeysStub = stubSshKeys([{ service: 'service', name: 'name', publicKey: 'publicKey' }]);
            const quickOpenService = testContainer.get(QuickOpenService);
            const quickOpenServiceSpy = sinon.spy(quickOpenService, 'open');
            const serviceSpy = sinon.spy(service, 'open');

            await service.copyPublicKey();

            assert(quickOpenServiceSpy.called);

            allKeysStub.restore();
            quickOpenServiceSpy.restore();


            const clipboardService = testContainer.get(ClipboardService);
            const clipboardServiceStub = sinon.stub(clipboardService, 'copy');

            const items = serviceSpy.firstCall.args[0];
            const item = items[0];
            item.run(QuickOpenMode.OPEN);

            assert(clipboardServiceStub.called);

            serviceSpy.restore();
            clipboardServiceStub.restore();
        });

        it('Should get notified if a key pair doesn\'t contain a public key', async () => {
            const allKeysStub = stubSshKeys([{ service: 'service', name: 'name' }]);
            const quickOpenService = testContainer.get(QuickOpenService);
            const quickOpenServiceSpy = sinon.spy(quickOpenService, 'open');
            const serviceOpenSpy = sinon.spy(service, 'open');

            await service.copyPublicKey();

            assert(quickOpenServiceSpy.called);

            allKeysStub.restore();
            quickOpenServiceSpy.restore();


            const messageService = testContainer.get(MessageService);
            const infoMessageSpy = sinon.spy(messageService, 'info');

            const items = serviceOpenSpy.firstCall.args[0];
            const item = items[0];
            item.run(QuickOpenMode.OPEN);

            assert(infoMessageSpy.calledAfter(serviceOpenSpy));
            assert(infoMessageSpy.calledOnce);

            serviceOpenSpy.restore();
            infoMessageSpy.restore();
        });

        it('Should get notified if failed to fetch the key pairs', async () => {
            const sshKeyServer = testContainer.get<SshKeyServer>(SshKeyServer);
            const allKeysStub = sinon.stub(sshKeyServer, 'getAll').rejects();
            const messageService = testContainer.get(MessageService);
            const errorMessageSpy = sinon.spy(messageService, 'error');

            await service.copyPublicKey();

            assert(errorMessageSpy.calledOnce);

            allKeysStub.restore();
            errorMessageSpy.restore();
        });

        it('Should get notified if no stored SSH key pairs', async () => {
            const allKeysStub = stubSshKeys([]);
            const messageService = testContainer.get(MessageService);
            const infoMessageSpy = sinon.spy(messageService, 'info');

            await service.copyPublicKey();

            assert(infoMessageSpy.calledOnce);

            allKeysStub.restore();
            infoMessageSpy.restore();
        });
    });

    describe('Deleting key pair', () => {
        it('Should delete a key pair', async () => {
            const allKeysStub = stubSshKeys([{ service: 'ssh service', name: 'key name' }]);
            const quickOpenService = testContainer.get(QuickOpenService);
            const quickOpenServiceSpy = sinon.spy(quickOpenService, 'open');
            const serviceSpy = sinon.spy(service, 'open');

            await service.deleteKeyPair();

            assert(quickOpenServiceSpy.called);

            allKeysStub.restore();
            quickOpenServiceSpy.restore();


            const sshKeyServer = testContainer.get<SshKeyServer>(SshKeyServer);
            const deleteSpy = sinon.spy(sshKeyServer, 'delete');

            const items = serviceSpy.firstCall.args[0];
            const item = items[0];
            item.run(QuickOpenMode.OPEN);

            assert(deleteSpy.called);

            deleteSpy.restore();
            serviceSpy.restore();
        });

        it('Should get notified if failed to fetch the key pairs', async () => {
            const sshKeyServer = testContainer.get<SshKeyServer>(SshKeyServer);
            const allKeysStub = sinon.stub(sshKeyServer, 'getAll').rejects();
            const messageService = testContainer.get(MessageService);
            const errorMessageSpy = sinon.spy(messageService, 'error');

            await service.deleteKeyPair();

            assert(errorMessageSpy.calledOnce);

            allKeysStub.restore();
            errorMessageSpy.restore();
        });

        it('Should get notified if no stored SSH key pairs', async () => {
            const allKeysStub = stubSshKeys([]);
            const messageService = testContainer.get(MessageService);
            const infoMessageSpy = sinon.spy(messageService, 'info');

            await service.deleteKeyPair();

            assert(infoMessageSpy.called);

            allKeysStub.restore();
            infoMessageSpy.restore();
        });
    });
});

function stubSshKeys(keys: SshKeyPair[]): SinonStub {
    const sshKeyServer = testContainer.get<SshKeyServer>(SshKeyServer);
    const allKeysStub = sinon.stub(sshKeyServer, 'getAll');
    return allKeysStub.resolves(keys);
}
