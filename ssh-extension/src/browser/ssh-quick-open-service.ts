/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { inject, injectable } from 'inversify';
import { MessageService } from '@theia/core';
import { QuickOpenOptions, QuickOpenMode } from '@theia/core/lib/browser';
import { QuickOpenService, QuickOpenModel, QuickOpenItem } from '@theia/core/lib/browser/quick-open/';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { ClipboardService } from './clipboard-service';
import { SshKeyServer, SshKeyPair } from '../common/ssh-protocol';

export interface CheService {
    name: string,
    displayName: string,
    description: string
}

@injectable()
export class SshQuickOpenService {

    /**
     * Known Che services which can use the SSH key pairs.
     */
    protected readonly services: CheService[];
    protected readonly downloadAction = 'Download';

    constructor(
        @inject(QuickOpenService) protected readonly quickOpenService: QuickOpenService,
        @inject(SshKeyServer) protected readonly sshKeyServer: SshKeyServer,
        @inject(MessageService) protected readonly messageService: MessageService,
        @inject(ClipboardService) protected readonly clipboardService: ClipboardService,
        @inject(WindowService) protected readonly windowService: WindowService
    ) {
        this.services = [
            { name: 'vcs', displayName: 'VCS', description: 'SSH keys used by Che VCS plugins' },
            { name: 'machine', displayName: 'Workspace Containers', description: 'SSH keys injected into all Workspace Containers' }
        ];
    }

    generateKeyPair(): void {
        const executeFn = async (service: string, name: string) => {
            try {
                const keyPair = await this.sshKeyServer.generate(service, name);
                if (service === 'machine' && keyPair.privateKey) {
                    const action = await this.messageService.info('Do you want to download generated private key?', this.downloadAction);
                    if (action === this.downloadAction) {
                        this.windowService.openNewWindow(`data:application/x-pem-key,${encodeURIComponent(keyPair.privateKey)}`);
                    }
                }
            } catch (error) {
                this.logError(error);
            }
        };

        this.chooseServiceAndName('Pick a Che service to generate SSH key pair for', executeFn);
    }

    createKeyPair(): void {
        const executeFn = (service: string, name: string) => {
            const __this = this;
            const quickOpenModel: QuickOpenModel = {
                onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
                    const items: QuickOpenItem[] = [];

                    if (lookFor === undefined || lookFor.length === 0) {
                        items.push(new ProvidePublicKeyItem());
                    } else {
                        const execute = async (item: ProvidePublicKeyItem) => {
                            try {
                                await __this.sshKeyServer.create({ service, name, publicKey: lookFor });
                            } catch (error) {
                                __this.logError(error);
                            }
                        };
                        items.push(new ProvidePublicKeyItem(execute));
                    }
                    acceptor(items);
                }
            }
            this.quickOpenService.open(quickOpenModel, this.getOptions('public key', false));
        }
        this.chooseServiceAndName('Pick a Che service to upload the public key for', executeFn, false);
    }

    async copyPublicKey(): Promise<void> {
        let keyPairs: SshKeyPair[];
        try {
            keyPairs = await this.fetchAllKeyPairs();
        } catch (error) {
            this.logError(error);
            return;
        }

        if (keyPairs.length === 0) {
            this.messageService.info('There are no SSH keys to copy');
            return;
        }

        const executeFn = (item: SshKeyPairItem) => {
            const chosenKeyPair = item.getKeyPair();
            const publicKey = chosenKeyPair.publicKey;
            if (publicKey && publicKey.length) {
                this.clipboardService.copy(publicKey);
            } else {
                this.messageService.info(`Key pair ${chosenKeyPair.name} doesn't contain a public key`);
            }
        };

        const items = keyPairs.map(keyPair => new SshKeyPairItem(keyPair, executeFn));
        this.open(items, 'Choose key pair to copy its public key to clipboard');
    }

    async deleteKeyPair(): Promise<void> {
        let keyPairs: SshKeyPair[];
        try {
            keyPairs = await this.fetchAllKeyPairs();
        } catch (error) {
            this.logError(error);
            return;
        }

        if (keyPairs.length === 0) {
            this.messageService.info('There are no SSH key pairs to delete');
            return;
        }

        const executeFn = async (item: SshKeyPairItem) => {
            try {
                const chosenKeyPair = item.getKeyPair();
                await this.sshKeyServer.delete(chosenKeyPair.service, chosenKeyPair.name);
            } catch (error) {
                this.logError(error);
            }
        };

        const items = keyPairs.map(keyPair => new SshKeyPairItem(keyPair, executeFn));
        this.open(items, 'Choose key pair to delete');
    }

    /**
     * Propose user to pick a Che service and enter a key pair name.
     * 
     * @param placeholder placeholder text
     * @param execFunc function to call when user enters a key pair name
     * @param canClose whether quick open service should be closed after entering a key pair name
     */
    protected chooseServiceAndName(
        placeholder: string,
        execFunc: (service: string, name: string) => void,
        canClose: boolean = true): void {

        const executeFn = (chosenServiceItem: SshServiceItem) => {
            const quickOpenModel: QuickOpenModel = {
                onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
                    const items: QuickOpenItem[] = [];
                    const description = chosenServiceItem.getService().name === 'vcs' ? 'e.g. github.com' : undefined;

                    if (lookFor === undefined || lookFor.length === 0) {
                        items.push(new ProvideKeyNameItem(description, () => { }, () => false));
                    } else {
                        const execute = (item: ProvideKeyNameItem) => execFunc(chosenServiceItem.getService().name, lookFor);
                        items.push(new ProvideKeyNameItem(description, execute, () => canClose));
                    }
                    acceptor(items);
                }
            }
            this.quickOpenService.open(quickOpenModel, this.getOptions(`Key pair name for ${chosenServiceItem.getLabel()}`, false));
        };

        const items = this.services.map(service => new SshServiceItem(service, executeFn));
        this.open(items, placeholder);
    }

    protected async fetchAllKeyPairs(): Promise<SshKeyPair[]> {
        const promises = this.services.map(service => this.sshKeyServer.getAll(service.name));
        const promiseResults = await Promise.all(promises);
        const keyPairs = promiseResults.reduce((prev, current) => prev.concat(current));
        return keyPairs;
    }

    open(items: QuickOpenItem | QuickOpenItem[], placeholder: string): void {
        this.quickOpenService.open(this.getModel(Array.isArray(items) ? items : [items]), this.getOptions(placeholder));
    }

    protected getModel(items: QuickOpenItem | QuickOpenItem[]): QuickOpenModel {
        return {
            onType(lookFor: string, acceptor: (items: QuickOpenItem[]) => void): void {
                acceptor(Array.isArray(items) ? items : [items]);
            }
        };
    }

    protected getOptions(placeholder: string, fuzzyMatchLabel: boolean = true): QuickOpenOptions {
        return QuickOpenOptions.resolve({
            placeholder,
            fuzzyMatchLabel,
            fuzzySort: false
        });
    }

    protected logError(error: any): void {
        const message = error instanceof Error ? error.message : error;
        this.messageService.error(message);
    }
}

/**
 * Item represents a Che service which can use the SSH key pairs.
 */
export class SshServiceItem extends QuickOpenItem {

    constructor(
        protected readonly service: CheService,
        protected readonly execute: (item: SshServiceItem) => void
    ) {
        super({
            label: `${service.displayName}`,
            detail: `${service.description}`
        });
    }

    getService(): CheService {
        return this.service;
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        this.execute(this);
        return false;
    }
}

/**
 * Item wraps SSH key pair.
 */
export class SshKeyPairItem extends QuickOpenItem {

    constructor(
        protected readonly keyPair: SshKeyPair,
        protected readonly execute: (item: SshKeyPairItem) => void
    ) {
        super({
            label: `${keyPair.name}`,
            description: `${keyPair.service}`
        });
    }

    getKeyPair(): SshKeyPair {
        return this.keyPair;
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        this.execute(this);
        return true;
    }
}

/**
 * Placeholder item for providing a key pair name.
 */
export class ProvideKeyNameItem extends QuickOpenItem {

    constructor(
        protected readonly description: string | undefined,
        protected readonly execute: (item: ProvideKeyNameItem) => void = () => { },
        private readonly canClose: (mode: QuickOpenMode) => boolean = mode => true
    ) {
        super({
            label: "Please provide a key pair name (Press 'Enter' to confirm or 'Escape' to cancel)",
            description: description
        });
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        this.execute(this);
        return this.canClose(mode);
    }
}

/**
 * Placeholder item for providing a public key.
 */
export class ProvidePublicKeyItem extends QuickOpenItem {
    constructor(
        protected readonly execute: (item: ProvidePublicKeyItem) => void = () => { }
    ) {
        super({ label: 'Please provide a public key' });
    }

    run(mode: QuickOpenMode): boolean {
        if (mode !== QuickOpenMode.OPEN) {
            return false;
        }
        this.execute(this);
        return true;
    }
}
