/*
 * Copyright (c) 2012-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import { h, VirtualNode } from '@phosphor/virtualdom';
import { VirtualWidget, VirtualRenderer, SingleTextInputDialog, ConfirmDialog } from '@theia/core/lib/browser';
import { SshKeyServer, SshKeyPair } from '../common/ssh-protocol';

export abstract class SshKeyPairAbstractWidget extends VirtualWidget {

    protected keyPairs: SshKeyPair[] = [];

    constructor(
        protected readonly service: string,
        protected readonly sshKeyServer: SshKeyServer
    ) {
        super();
        this.addClass('theia-ssh');
        this.update();
        this.fetchKeys();
    }

    protected async fetchKeys() {
        const keyPairs = await this.sshKeyServer.list(this.service, undefined);
        this.keyPairs = [...keyPairs];
        this.update();
    }

    protected render(): h.Child {
        const commandBar = this.renderCommandBar();
        const keyList = this.renderKeyList();
        return [commandBar, keyList];
    }

    protected renderCommandBar(): VirtualNode {
        const dialog = new SingleTextInputDialog({
            title: `New SSH key pair`,
            initialValue: 'Remote host name/IP, e.g. github.com'
        });
        const generateButton = h.button({
            className: 'theia-button',
            title: 'Generate new SSH key pair',
            onclick: () => {
                dialog.open().then(async name => {
                    await this.sshKeyServer.generate(this.service, name);
                    this.fetchKeys();
                });
            }
        }, 'Generate...');
        const uploadButton = h.button({
            className: 'theia-button',
            title: 'Upload public key',
            onclick: () => { }
        }, 'Upload...');
        return h.div({ className: 'buttons' }, generateButton, uploadButton);
    }

    protected renderKeyList(): VirtualNode {
        const theList: h.Child[] = [];
        this.keyPairs.forEach(key => {
            const container = this.renderKey(key);
            theList.push(container);
        });

        return h.div({
            id: 'keyListContainer'
        }, VirtualRenderer.flatten(theList));
    }

    protected renderKey(key: SshKeyPair): VirtualNode {
        const name = h.div({
            className: 'keyName'
        }, key.name);

        const viewButton = h.button({
            className: 'theia-button',
            title: 'View public key',
            onclick: async () => {
                // TODO: show public key
            }
        }, 'View');

        const shouldDelete = async (): Promise<boolean> => {
            const dialog = new ConfirmDialog({
                title: 'Delete SSH key pair',
                msg: `Do you really want to delete SSH keys for '${key.name}' host?`,
                ok: 'Yes',
                cancel: 'No'
            });
            return dialog.open();
        };

        const deleteButton = h.button({
            className: 'theia-button',
            title: 'Delete key pair',
            onclick: async () => {
                if (await shouldDelete()) {
                    await this.sshKeyServer.delete(key.service, key.name);
                    this.fetchKeys();
                }
            }
        }, 'Delete...');

        return h.div({
            className: 'sshItem'
        }, name, viewButton, deleteButton);
    }
}
