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

import { ContainerModule } from 'inversify';
import { JsonRpcConnectionHandler, ConnectionHandler } from '@theia/core/lib/common';
import { FakeSshKeyServer } from './fake-ssh-key-server';
import { SshKeyServer, sshKeyServicePath } from '../common/ssh-protocol';

export default new ContainerModule(bind => {
    bind(SshKeyServer).to(FakeSshKeyServer).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(sshKeyServicePath, () =>
            ctx.container.get(SshKeyServer)
        )
    ).inSingletonScope();
});
