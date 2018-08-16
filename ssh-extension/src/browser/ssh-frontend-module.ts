/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { ContainerModule } from 'inversify';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { CommandContribution } from '@theia/core/lib/common';
import { ClipboardService } from './clipboard-service';
import { SshFrontendContribution } from './ssh-frontend-contribution';
import { SshQuickOpenService } from './ssh-quick-open-service';
import { SshKeyServer, sshKeyServicePath } from '../common/ssh-protocol';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(SshFrontendContribution).inSingletonScope();
    bind(SshQuickOpenService).toSelf().inSingletonScope();
    bind(ClipboardService).toSelf().inSingletonScope();
    bind(SshKeyServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<SshKeyServer>(sshKeyServicePath);
    }).inSingletonScope();
});
