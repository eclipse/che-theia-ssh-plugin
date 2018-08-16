/*********************************************************************
 * Copyright (c) 2018 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { injectable } from 'inversify';

/**
 * Enumeration of currently supported environment variable names
 */
enum VarNames {
    /*
     * Che API endpoint location represented as a string (e.g.
     * 'http://localhost:8080/api')
     */
    CHE_API = 'CHE_API',
    /*
     * Boolean value represented as a string that shows if Che authentication
     * is enabled or not
     */
    CHE_AUTH_ENABLED = 'CHE_AUTH_ENABLED',
    /*
     * Che machine token value represented as a string
     */
    CHE_MACHINE_TOKEN = 'CHE_MACHINE_TOKEN',
    /*
     * Che MySQL database name represented as a string
     */
    CHE_MYSQL_DB = 'CHE_MYSQL_DB',
    /*
     * Che MySQL database access user password
     */
    CHE_MYSQL_PASSWORD = 'CHE_MYSQL_PASSWORD',
    /*
     * Che MySQL database access user name
     */
    CHE_MYSQL_USER = 'CHE_MYSQL_USER',
    /*
     * Location of Che project root directory on a file system
     */
    CHE_PROJECTS_ROOT = 'CHE_PROJECTS_ROOT',
    /*
     * Che workspace identifier represented as a string
     */
    CHE_WORKSPACE_ID = 'CHE_WORKSPACE_ID'
}

@injectable()
export class EnvVars {

    private readonly vars: Map<string, string> = new Map();

    constructor() {
        Object.keys(VarNames).forEach(value => {
            if (process.env.hasOwnProperty(value)) {
                this.vars.set(value, process.env[value] as string);
            }
        });
    }

    /**
     * Che API endpoint location
     *
     * @returns {string | undefined}
     */
    get cheApi() {
        return this.vars.get(VarNames.CHE_API);
    }

    /**
     * Che authentication status
     *
     * @returns {string | undefined}
     */
    get cheAuthEnabled() {
        return this.vars.get(VarNames.CHE_AUTH_ENABLED);
    }

    /**
     * Che machine token
     *
     * @returns {string | undefined}
     */
    get cheMachineToken() {
        return this.vars.get(VarNames.CHE_MACHINE_TOKEN);
    }

    /**
     * Che MySQL database name
     *
     * @returns {string | undefined}
     */
    get cheMysqlDb() {
        return this.vars.get(VarNames.CHE_MYSQL_DB);
    }

    /**
     * Che MySQL database user password
     *
     * @returns {string | undefined}
     */
    get cheMysqlPassword() {
        return this.vars.get(VarNames.CHE_MYSQL_PASSWORD);
    }

    /**
     * Che MySQL database user name
     *
     * @returns {string | undefined}
     */
    get cheMysqlUser() {
        return this.vars.get(VarNames.CHE_MYSQL_USER);
    }

    /**
     * Che project root location
     * @returns {string | undefined}
     */
    get cheProjectsRoot() {
        return this.vars.get(VarNames.CHE_PROJECTS_ROOT);
    }

    /**
     * Che workspace identifier
     *
     * @returns {string | undefined}
     */
    get cheWorkspaceId() {
        return this.vars.get(VarNames.CHE_WORKSPACE_ID);
    }
}
