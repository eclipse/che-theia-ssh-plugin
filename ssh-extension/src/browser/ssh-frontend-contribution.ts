/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable, inject } from 'inversify';
import { Command, CommandRegistry, CommandContribution } from '@theia/core';
import { SshQuickOpenService } from './ssh-quick-open-service';

export namespace SshCommands {
    export const GENERATE: Command = {
        id: 'ssh:generate',
        label: 'SSH: generate key pair...'
    };
    export const CREATE: Command = {
        id: 'ssh:create',
        label: 'SSH: create key pair...'
    };
    export const COPY: Command = {
        id: 'ssh:copy',
        label: 'SSH: copy public key to clipboard...'
    };
    export const DELETE: Command = {
        id: 'ssh:delete',
        label: 'SSH: delete key pair...'
    };
}

@injectable()
export class SshFrontendContribution implements CommandContribution {

    constructor(
        @inject(SshQuickOpenService) protected readonly sshQuickOpenService: SshQuickOpenService
    ) { }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(SshCommands.GENERATE, {
            isEnabled: () => true,
            execute: () => this.sshQuickOpenService.generateKeyPair()
        });
        commands.registerCommand(SshCommands.CREATE, {
            isEnabled: () => true,
            execute: () => this.sshQuickOpenService.createKeyPair()
        });
        commands.registerCommand(SshCommands.COPY, {
            isEnabled: () => true,
            execute: () => this.sshQuickOpenService.copyPublicKey()
        });
        commands.registerCommand(SshCommands.DELETE, {
            isEnabled: () => true,
            execute: () => this.sshQuickOpenService.deleteKeyPair()
        });
    }
}
