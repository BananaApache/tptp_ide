"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// extension.ts - VS Code Extension Client
const path = require("path");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    // Server is implemented in TypeScript and runs in a separate process
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    // Debug options for the server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // Server options for running the server as a Node.js process
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Client options
    const clientOptions = {
        // Register the server for TPTP documents
        documentSelector: [{ scheme: 'file', language: 'tptp' }],
        synchronize: {
            // Synchronize configuration changes
            configurationSection: 'tptpLanguageServer',
            // Notify the server about file changes to '.p' files in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.p')
        }
    };
    // Create the language client
    client = new node_1.LanguageClient('tptpLanguageServer', 'TPTP Language Server', serverOptions, clientOptions);
    // Start the client (and server)
    client.start();
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
//# sourceMappingURL=extension.js.map