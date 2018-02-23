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

import { injectable, inject } from 'inversify';
import { CommandContribution, CommandRegistry } from '@theia/core/lib/common';
import { SshManagerDialog } from './ssh-manager-dialog';
import { SshKeyPairMachineWidget } from './ssh-key-pair-machine-widget';
import { SshKeyPairVCSWidget } from './ssh-key-pair-vcs-widget';
import { SshKeyServer } from '../common/ssh-protocol';

export const MANAGE_SSH_KEY_VCS_COMMAND = {
    id: 'ssh-key-vcs-manage.openDialog',
    label: 'Manage SSH keys for VCS...'
};
export const MANAGE_SSH_KEY_MACHINE_COMMAND = {
    id: 'ssh-key-machine-manage.openDialog',
    label: 'Manage SSH keys for Che machines...'
};

@injectable()
export class SshFrontendContribution implements CommandContribution {

    constructor(
        @inject(SshKeyServer) protected readonly sshKeyServer: SshKeyServer
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(MANAGE_SSH_KEY_VCS_COMMAND, {
            execute: () => {
                // TODO: bind with factory
                const widget = new SshKeyPairVCSWidget(this.sshKeyServer);
                const dialog = new SshManagerDialog({ title: 'Manage SSH keys for VCS' }, widget);
                dialog.open();
            }
        });
        registry.registerCommand(MANAGE_SSH_KEY_MACHINE_COMMAND, {
            execute: () => {
                // TODO: bind with factory
                const widget = new SshKeyPairMachineWidget(this.sshKeyServer);
                const dialog = new SshManagerDialog({ title: 'Manage SSH keys for Che machines' }, widget);
                dialog.open();
            }
        });
    }
}
