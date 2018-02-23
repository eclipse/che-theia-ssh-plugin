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

import { SshKeyPairAbstractWidget } from './ssh-key-pair-abstract-widget';
import { SshKeyServer } from '../common/ssh-protocol';

export class SshKeyPairMachineWidget extends SshKeyPairAbstractWidget {

    constructor(protected readonly sshKeyServer: SshKeyServer) {
        super('machine', sshKeyServer);
    }
}
