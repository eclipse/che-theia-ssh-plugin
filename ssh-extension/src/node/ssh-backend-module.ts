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
import { JsonRpcConnectionHandler, ConnectionHandler } from '@theia/core/lib/common';
import { SshKeyServerImpl } from './ssh-key-server';
import { SshKeyServer, sshKeyServicePath } from '../common/ssh-protocol';
import { SshKeyManager, RemoteSshKeyManager } from './ssh-key-manager';
import { SshKeyServiceClient, SshKeyServiceHttpClient } from './ssh-key-service-client';
import { EnvVars } from './env-vars';
import { WsMasterHttpClient } from './ws-master-http-client';

export default new ContainerModule(bind => {
    bind(EnvVars).toSelf();
    bind(WsMasterHttpClient).toSelf();

    bind(SshKeyServer).to(SshKeyServerImpl).inSingletonScope();
    bind(SshKeyManager).to(RemoteSshKeyManager).inSingletonScope();
    bind(SshKeyServiceClient).to(SshKeyServiceHttpClient).inSingletonScope();

    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(sshKeyServicePath, () =>
            ctx.container.get(SshKeyServer)
        )
    ).inSingletonScope();
});
