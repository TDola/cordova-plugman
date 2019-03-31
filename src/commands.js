/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

// copyright (c) 2013 Andrew Lunny, Adobe Systems

const pEachSeries = require('p-each-series');
const { plugman } = require('cordova-lib');

module.exports = {
    install (cli_opts) {
        if (!cli_opts.platform || !cli_opts.project || !cli_opts.plugin) {
            return console.log(plugman.help());
        }

        var opts = {
            subdir: '.',
            cli_variables: expandCliVariables(cli_opts.variable),
            save: cli_opts.save || false,
            www_dir: cli_opts.www,
            searchpath: cli_opts.searchpath,
            link: cli_opts.link,
            projectRoot: cli_opts.project,
            force: cli_opts.force || false,
            nohooks: cli_opts.nohooks || false
        };

        return pEachSeries(cli_opts.plugin, pluginSrc =>
            plugman.install(cli_opts.platform, cli_opts.project, pluginSrc, cli_opts.plugins_dir, opts)
        );
    },

    uninstall (cli_opts) {
        if (!cli_opts.platform || !cli_opts.project || !cli_opts.plugin) {
            return console.log(plugman.help());
        }

        var opts = {
            www_dir: cli_opts.www,
            save: cli_opts.save || false,
            projectRoot: cli_opts.project
        };

        return pEachSeries(cli_opts.plugin, pluginSrc =>
            plugman.uninstall(cli_opts.platform, cli_opts.project, pluginSrc, cli_opts.plugins_dir, opts)
        );
    },

    create (cli_opts) {
        if (!cli_opts.name || !cli_opts.plugin_id || !cli_opts.plugin_version) {
            return console.log(plugman.help());
        }
        const cli_variables = expandCliVariables(cli_opts.variable);
        return plugman.create(cli_opts.name, cli_opts.plugin_id, cli_opts.plugin_version, cli_opts.path || '.', cli_variables);
    },

    platform (cli_opts) {
        var operation = cli_opts.argv.remain[ 0 ] || '';
        if ((operation !== 'add' && operation !== 'remove') || !cli_opts.platform_name) {
            return console.log(plugman.help());
        }
        return plugman.platform({ operation: operation, platform_name: cli_opts.platform_name });
    },

    createpackagejson (cli_opts) {
        var plugin_path = cli_opts.argv.remain[0];
        if (!plugin_path) {
            return console.log(plugman.help());
        }
        return plugman.createpackagejson(plugin_path);
    }
};

function expandCliVariables (cliVarList) {
    return (cliVarList || []).reduce((cli_variables, variable) => {
        var tokens = variable.split('=');
        var key = tokens.shift().toUpperCase();
        if (/^[\w-_]+$/.test(key)) cli_variables[key] = tokens.join('=');
        return cli_variables;
    }, {});
}
