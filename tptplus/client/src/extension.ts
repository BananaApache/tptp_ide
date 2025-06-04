// extension.ts - VS Code Extension Client
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // Server is implemented in TypeScript and runs in a separate process
  const serverModule = context.asAbsolutePath(
    path.join('server', 'out', 'server.js')
  );
  
  // Debug options for the server
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // Server options for running the server as a Node.js process
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  // Client options
  const clientOptions: LanguageClientOptions = {
    // Register the server for TPTP documents
    documentSelector: [{ scheme: 'file', language: 'tptp' }],
    synchronize: {
      // Synchronize configuration changes
      configurationSection: 'tptpLanguageServer',
      // Notify the server about file changes to '.p' files in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.p')
    }
  };

  // Create the language client
  client = new LanguageClient(
    'tptpLanguageServer',
    'TPTP Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client (and server)
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}