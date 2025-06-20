// extension.ts - VS Code Extension Client
import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import * as vscode from "vscode";
import { JSDOM } from 'jsdom';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

  //@ PREPARE A PROBLEM THROUGH SYSTEMB4TPTP
  const prepareProblem = vscode.commands.registerCommand('tptp.prepareProblem', async (uri: vscode.Uri) => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const fullTextRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(document.getText().length)
      );

      const form = new FormData();
      form.append('TPTPProblem', '');
      form.append('ProblemSource', 'FORMULAE');
      form.append('FORMULAEProblem', document.getText(fullTextRange));
      form.append('UPLOADProblem', '');
      form.append('FormulaURL', '');
      form.append('InputFormat', 'TPTP');
      form.append('QuietFlag', '-q01');
      form.append('SubmitButton', 'ProcessProblem');
      form.append('TimeLimit___AddTypes---1.2.4', '60');
      form.append('Transform___AddTypes---1.2.4', 'none');
      form.append('Format___AddTypes---1.2.4', 'tptp:raw');
      form.append('Command___AddTypes---1.2.4', 'run_addtypes %s');
      form.append('TimeLimit___ASk---0.2.3', '60');
      form.append('Transform___ASk---0.2.3', 'none');
      form.append('Format___ASk---0.2.3', 'tptp:raw');
      form.append('Command___ASk---0.2.3', 'run_ASk %s');
      form.append('TimeLimit___BNFParser---0.0', '60');
      form.append('Transform___BNFParser---0.0', 'none');
      form.append('Format___BNFParser---0.0', 'tptp:raw');
      form.append('Command___BNFParser---0.0', 'BNFParser %s');
      form.append('TimeLimit___BNFParserTree---0.0', '60');
      form.append('Transform___BNFParserTree---0.0', 'none');
      form.append('Format___BNFParserTree---0.0', 'tptp:raw');
      form.append('Command___BNFParserTree---0.0', 'BNFParserTree %s');
      form.append('TimeLimit___CheckTyping---0.0', '60');
      form.append('Transform___CheckTyping---0.0', 'none');
      form.append('Format___CheckTyping---0.0', 'tptp:raw');
      form.append('Command___CheckTyping---0.0', 'CheckTyping -all %s');
      form.append('TimeLimit___ECNF---3.2.5', '60');
      form.append('Transform___ECNF---3.2.5', 'none');
      form.append('Format___ECNF---3.2.5', 'tptp:raw');
      form.append('Command___ECNF---3.2.5', 'run_ECNF %d %s');
      form.append('TimeLimit___EGround---3.2.5', '60');
      form.append('Transform___EGround---3.2.5', 'add_equality');
      form.append('Format___EGround---3.2.5', 'tptp:raw');
      form.append('Command___EGround---3.2.5', 'eground --tstp-in --tstp-out --silent --resources-info --split-tries=100 --memory-limit=200 --soft-cpu-limit=%d --add-one-instance --constraints %s');
      form.append('TimeLimit___ESelect---3.2.5', '60');
      form.append('Transform___ESelect---3.2.5', 'none');
      form.append('Format___ESelect---3.2.5', 'tptp:raw');
      form.append('Command___ESelect---3.2.5', 'eprover --sine=Auto --prune %s');
      form.append('TimeLimit___GetSymbols---0.0', '60');
      form.append('Transform___GetSymbols---0.0', 'none');
      form.append('Format___GetSymbols---0.0', 'tptp:raw');
      form.append('Command___GetSymbols---0.0', 'GetSymbols -all %s');
      form.append('TimeLimit___Horn2UEQ---0.4.1', '60');
      form.append('Transform___Horn2UEQ---0.4.1', 'none');
      form.append('Format___Horn2UEQ---0.4.1', 'tptp:raw');
      form.append('Command___Horn2UEQ---0.4.1', 'jukebox_horn2ueq %s');
      form.append('TimeLimit___Isabelle---2FOF', '60');
      form.append('Transform___Isabelle---2FOF', 'none');
      form.append('Format___Isabelle---2FOF', 'tptp');
      form.append('Command___Isabelle---2FOF', 'run_isabelle_2X FOF %s');
      form.append('TimeLimit___Isabelle---2TF0', '60');
      form.append('Transform___Isabelle---2TF0', 'none');
      form.append('Format___Isabelle---2TF0', 'tptp');
      form.append('Command___Isabelle---2TF0', 'run_isabelle_2X TF0 %s');
      form.append('TimeLimit___Isabelle---2TH0', '60');
      form.append('Transform___Isabelle---2TH0', 'none');
      form.append('Format___Isabelle---2TH0', 'tptp');
      form.append('Command___Isabelle---2TH0', 'run_isabelle_2X TH0 %s');
      form.append('TimeLimit___Leo-III-STC---1.7.18', '60');
      form.append('Transform___Leo-III-STC---1.7.18', 'none');
      form.append('Format___Leo-III-STC---1.7.18', 'tptp:raw');
      form.append('Command___Leo-III-STC---1.7.18', 'run_Leo-III %s %d STC');
      form.append('TimeLimit___Monotonox---0.4.1', '60');
      form.append('Transform___Monotonox---0.4.1', 'none');
      form.append('Format___Monotonox---0.4.1', 'tptp:raw');
      form.append('Command___Monotonox---0.4.1', 'jukebox monotonox %s');
      form.append('TimeLimit___Monotonox-2CNF---0.4.1', '60');
      form.append('Transform___Monotonox-2CNF---0.4.1', 'none');
      form.append('Format___Monotonox-2CNF---0.4.1', 'tptp:raw');
      form.append('Command___Monotonox-2CNF---0.4.1', 'jukebox_cnf %s');
      form.append('TimeLimit___Monotonox-2FOF---0.4.1', '60');
      form.append('Transform___Monotonox-2FOF---0.4.1', 'none');
      form.append('Format___Monotonox-2FOF---0.4.1', 'tptp:raw');
      form.append('Command___Monotonox-2FOF---0.4.1', 'jukebox_fof %s');
      form.append('TimeLimit___NTFLET---1.8.5', '60');
      form.append('Transform___NTFLET---1.8.5', 'none');
      form.append('Format___NTFLET---1.8.5', 'tptp:raw');
      form.append('Command___NTFLET---1.8.5', 'run_embed %s');
      form.append('TimeLimit___ProblemStats---1.0', '60');
      form.append('Transform___ProblemStats---1.0', 'none');
      form.append('Format___ProblemStats---1.0', 'tptp:raw');
      form.append('Command___ProblemStats---1.0', 'run_MakeListStats %s');
      form.append('TimeLimit___Prophet---0.0', '60');
      form.append('Transform___Prophet---0.0', 'none');
      form.append('Format___Prophet---0.0', 'tptp');
      form.append('Command___Prophet---0.0', 'prophet %s');
      form.append('TimeLimit___Saffron---4.5', '60');
      form.append('Transform___Saffron---4.5', 'none');
      form.append('Format___Saffron---4.5', 'tptp:raw');
      form.append('Command___Saffron---4.5', 'run_saffron %s %d');
      form.append('TimeLimit___SPCForProblem---1.0', '60');
      form.append('Transform___SPCForProblem---1.0', 'none');
      form.append('Format___SPCForProblem---1.0', 'tptp:raw');
      form.append('Command___SPCForProblem---1.0', 'run_SPCForProblem %s');
      form.append('TimeLimit___TPII---0.0', '60');
      form.append('Transform___TPII---0.0', 'none');
      form.append('Format___TPII---0.0', 'tptp:raw');
      form.append('Command___TPII---0.0', 'TPII %s');
      form.append('TimeLimit___TPTP2JSON---0.1', '60');
      form.append('Transform___TPTP2JSON---0.1', 'none');
      form.append('Format___TPTP2JSON---0.1', 'tptp:raw');
      form.append('Command___TPTP2JSON---0.1', 'run_tptp2json %s');
      form.append('TimeLimit___TPTP2X---0.0', '60');
      form.append('Transform___TPTP2X---0.0', 'none');
      form.append('Format___TPTP2X---0.0', 'tptp:raw');
      form.append('Command___TPTP2X---0.0', 'tptp2X -q2 -d- %s');
      form.append('TimeLimit___TPTP4X---0.0', '60');
      form.append('Transform___TPTP4X---0.0', 'none');
      form.append('Format___TPTP4X---0.0', 'tptp:raw');
      form.append('Command___TPTP4X---0.0', 'tptp4X %s');
      form.append('TimeLimit___VCNF---4.8', '60');
      form.append('Transform___VCNF---4.8', 'none');
      form.append('Format___VCNF---4.8', 'tptp:raw');
      form.append('Command___VCNF---4.8', 'run_vclausify_rel %s %d');
      form.append('TimeLimit___VSelect---4.4', '60');
      form.append('Transform___VSelect---4.4', 'none');
      form.append('Format___VSelect---4.4', 'tptp:raw');
      form.append('Command___VSelect---4.4', 'run_sine_select %s');
      form.append('TimeLimit___Why3-FOF---0.85', '60');
      form.append('Transform___Why3-FOF---0.85', 'none');
      form.append('Format___Why3-FOF---0.85', 'tptp:raw');
      form.append('Command___Why3-FOF---0.85', 'bin/why3 prove -F tptp -C /home/tptp/Systems/Why3---0.85/why3.conf -D /home/tptp/Systems/Why3---0.85/Source/drivers/tptp.gen %s');
      form.append('TimeLimit___Why3-TF0---0.85', '60');
      form.append('Transform___Why3-TF0---0.85', 'none');
      form.append('Format___Why3-TF0---0.85', 'tptp:raw');
      form.append('Command___Why3-TF0---0.85', 'bin/why3 prove -F tptp -C /home/tptp/Systems/Why3---0.85/why3.conf -D /home/tptp/Systems/Why3---0.85/Source/drivers/tptp-tff0.drv %s');

      const response = await fetch('https://tptp.org/cgi-bin/SystemOnTPTPFormReply', {
        method: 'POST',
        body: form
      });
      const text = await response.text();
      const match = text.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);

      let output = document.getText(fullTextRange);

      if (match) {  
        output = match[1].split("\n").slice(2, match[1].split("\n").length - 4).join("\n")
      }

      editor.edit(editBuilder => {
        editBuilder.replace(fullTextRange, output.replace("&gt;", ">"));
      });
    } else {
      vscode.window.showInformationMessage("No active editor.");
    }
    
  })

  context.subscriptions.push(prepareProblem);

  //@ RUN A THEOREM THROUGH SYSTEMONTPTP                                              
  const proveProblem = vscode.commands.registerCommand('tptp.proveProblem', async (uri: vscode.Uri) => {
    const doc = await vscode.workspace.openTextDocument(uri);
    const content = doc.getText();

    const panel = vscode.window.createWebviewPanel(
      'customMenu',
      'TPTP Options',
      vscode.ViewColumn.Two,
      { enableScripts: true }  // allow JS
    );

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>TPTP Prover Options</title>
        <style>
          .collapsable button { background-color: var(--vscode-activityBar-border) } 
          body {
            font-family: "Inter", sans-serif;
          }

          h1 { 
            text-decoration: underline; 
          }

          label {
            display: flex;
            cursor: pointer;
            font-weight: 500;
            position: relative;
            overflow: hidden;
            margin-bottom: 0.375em;
          }

          label input {
            position: absolute;
            left: -9999px;
          }

          label input:checked + span {
            background-color: var(--vscode-button-background);
          }

          label input:checked + span:before {
            box-shadow: inset 0 0 0 0.4375em #00005c;
          }

          label span {
            display: flex;
            align-items: center;
            padding: 0.375em 0.75em 0.375em 0.375em;
            border-radius: 99em;
            transition: 0.25s ease;
          }

          label span:hover {
            background-color: var(--vscode-button-hoverBackground);
          }

          label span:before {
            display: flex;
            flex-shrink: 0;
            content: "";
            background-color: #fff;
            width: 1.5em;
            height: 1.5em;
            border-radius: 50%;
            margin-right: 0.375em;
            transition: 0.25s ease;
            box-shadow: inset 0 0 0 0.125em #00005c;
          }

          .submit-btn {
            align-items: center;
            appearance: button;
            background-color: var(--vscode-focusBorder);
            border-radius: 8px;
            border-style: none;
            box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
            box-sizing: border-box;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            flex-shrink: 0;
            font-family: "Segoe UI", sans-serif;
            font-size: 100%;
            line-height: 1.15;
            margin: 0;
            padding: 10px 21px;
            text-align: center;
            text-transform: none;
            transition:
              color 0.13s ease-in-out,
              background 0.13s ease-in-out,
              opacity 0.13s ease-in-out,
              box-shadow 0.13s ease-in-out;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }

          .filename-txt {
            color: var(--vscode-editorLightBulb-foreground);
          }

          form { line-height: 20px; }
        </style>
      </head>
      <body>
        <h1>Run TPTP Prover</h1>
        <p class="filename-txt">File: ${path.basename(doc.uri.fsPath)}</p>

        <form id="optionForm">
          <h2>Select a Prover</h2>
          <label> <input type="radio" name="prover" value="agsyHOL---1.0"> <span>agsyHOL 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Alt-Ergo---0.95.2"> <span>Alt-Ergo 0.95.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="Beagle---0.9.52"> <span>Beagle 0.9.52</span> <br> </label>
          <label> <input type="radio" name="prover" value="Bliksem---1.12"> <span>Bliksem 1.12</span> <br> </label>
          <label> <input type="radio" name="prover" value="ConnectPP---0.6.0"> <span>ConnectPP 0.6.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="CSE_E---1.6"> <span>CSE_E 1.6</span> <br> </label>
          <label> <input type="radio" name="prover" value="CSI_E---1.1"> <span>CSI_E 1.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="cvc5---1.2.1"> <span>cvc5 1.2.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="cvc5-SAT---1.2.1"> <span>cvc5-SAT 1.2.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Darwin---1.4.5"> <span>Darwin 1.4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="DarwinFM---1.4.5"> <span>DarwinFM 1.4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="DLash---1.11"> <span>DLash 1.11</span> <br> </label>
          <label> <input type="radio" name="prover" value="Drodi---4.1.0"> <span>Drodi 4.1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="DT2H2X---1.8.4"> <span>DT2H2X 1.8.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Duper---1.0"> <span>Duper 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="E---3.2.5"> <span>E 3.2.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="E-SAT---3.2.5"> <span>E-SAT 3.2.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="Enigma---0.5.1"> <span>Enigma 0.5.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Etableau---0.67"> <span>Etableau 0.67</span> <br> </label>
          <label> <input type="radio" name="prover" value="E-Darwin---1.5"> <span>E-Darwin 1.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="EQP---0.9e"> <span>EQP 0.9e</span> <br> </label>
          <label> <input type="radio" name="prover" value="Equinox---6.0.1a"> <span>Equinox 6.0.1a</span> <br> </label>
          <label> <input type="radio" name="prover" value="FEST---2.0.1"> <span>FEST 2.0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Geo-III---2018C"> <span>Geo-III 2018C</span> <br> </label>
          <label> <input type="radio" name="prover" value="Goeland---1.0.0"> <span>Goeland 1.0.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="GKC---0.8"> <span>GKC 0.8</span> <br> </label>
          <label> <input type="radio" name="prover" value="GrAnDe---1.1"> <span>GrAnDe 1.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="HOLyHammer---0.21"> <span>HOLyHammer 0.21</span> <br> </label>
          <label> <input type="radio" name="prover" value="Imogen---2.0"> <span>Imogen 2.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Infinox---1.0"> <span>Infinox 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver---3.9"> <span>iProver 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver-SAT---3.9"> <span>iProver-SAT 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProverMo---2.5-0.1"> <span>iProverMo 2.5-0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver-Eq---0.85"> <span>iProver-Eq 0.85</span> <br> </label>
          <label> <input type="radio" name="prover" value="Isabelle---2024"> <span>Isabelle 2024</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---A3-0.2"> <span>JGXYZ A3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDECmi-0.2"> <span>JGXYZ FDECmi-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDECon-0.2"> <span>JGXYZ FDECon-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDELuk-0.2"> <span>JGXYZ FDELuk-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FOF-0.2"> <span>JGXYZ FOF-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---L3-0.2"> <span>JGXYZ L3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---RM3-0.2"> <span>JGXYZ RM3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="KSP---0.1.7"> <span>KSP 0.1.7</span> <br> </label>
          <label> <input type="radio" name="prover" value="Lash---1.13"> <span>Lash 1.13</span> <br> </label>
          <label> <input type="radio" name="prover" value="lazyCoP---0.1"> <span>lazyCoP 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="leanCoP---2.2"> <span>leanCoP 2.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="LEO-II---1.7.0"> <span>LEO-II 1.7.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Leo-III---1.7.19"> <span>Leo-III 1.7.19</span> <br> </label>
          <label> <input type="radio" name="prover" value="Leo-III-SAT---1.7.19"> <span>Leo-III-SAT 1.7.19</span> <br> </label>
          <label> <input type="radio" name="prover" value="Mace4---1109a"> <span>Mace4 1109a</span> <br> </label>
          <label> <input type="radio" name="prover" value="MaedMax---1.4"> <span>MaedMax 1.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Matita---1.0"> <span>Matita 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Metis---2.4"> <span>Metis 2.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Moca---0.1"> <span>Moca 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Muscadet---4.5"> <span>Muscadet 4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="nanoCoP---2.0"> <span>nanoCoP 2.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Nitpick---2024"> <span>Nitpick 2024</span> <br> </label>
          <label> <input type="radio" name="prover" value="Otter---3.3"> <span>Otter 3.3</span> <br> </label>
          <label> <input type="radio" name="prover" value="Paradox---4.0"> <span>Paradox 4.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Princess---230619"> <span>Princess 230619</span> <br> </label>
          <label> <input type="radio" name="prover" value="Prover9---1109a"> <span>Prover9 1109a</span> <br> </label>
          <label> <input type="radio" name="prover" value="PyRes---1.5"> <span>PyRes 1.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="RPx---1.0"> <span>RPx 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Satallax---3.5"> <span>Satallax 3.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="SATCoP---0.1"> <span>SATCoP 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Scavenger---EP-0.2"> <span>Scavenger EP-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="SnakeForV---1.0"> <span>SnakeForV 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="SnakeForV-SAT---1.0"> <span>SnakeForV-SAT 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="SNARK---20120808r022"> <span>SNARK 20120808r022</span> <br> </label>
          <label> <input type="radio" name="prover" value="SPASS---3.9"> <span>SPASS 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="SPASS+T---2.2.22"> <span>SPASS+T 2.2.22</span> <br> </label>
          <label> <input type="radio" name="prover" value="SRASS---0.1"> <span>SRASS 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ToFoF---0.1"> <span>ToFoF 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ToFoF-SAT---0.1"> <span>ToFoF-SAT 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Toma---0.4"> <span>Toma 0.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="TPS---3.120601S1b"> <span>TPS 3.120601S1b</span> <br> </label>
          <label> <input type="radio" name="prover" value="Twee---2.5.0"> <span>Twee 2.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire---4.9"> <span>Vampire 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire-SAT---4.9"> <span>Vampire-SAT 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="VampireLite---4.9"> <span>VampireLite 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire-FMo---4.9"> <span>Vampire-FMo 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Waldmeister---710"> <span>Waldmeister 710</span> <br> </label>
          <label> <input type="radio" name="prover" value="Z3---4.15.1"> <span>Z3 4.15.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Zenon---0.7.1"> <span>Zenon 0.7.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModulo---0.5.0"> <span>ZenonModulo 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModuloLP---0.5.0"> <span>ZenonModuloLP 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModuloDK---0.5.0"> <span>ZenonModuloDK 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Zipperpin---2.1"> <span>Zipperpin 2.1</span> <br> </label>
          <br>

          <h2>Continue to</h2>
          <label> <input type="radio" name="continueOption" value="normal_output"> <span>Normal Output</span> <br> </label>
          <label> <input type="radio" name="continueOption" value="tptp_format"> <span>TPTP Format</span> <br> </label>
          <label> <input type="radio" name="continueOption" value="idv_image"> <span>IDV Image</span> <br> </label>
          <br>

          <button class="submit-btn" type="submit">Prove</button>
          </form>
        <br><br><br><br>

        <script>
          const vscode = acquireVsCodeApi();

          document.getElementById('optionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const proverInput = document.querySelector('input[type="radio"]:checked');
            const prover = proverInput ? proverInput.value : null;

            const continueOptionInput = document.querySelector('input[name="continueOption"]:checked');
            const continueOption = continueOptionInput ? continueOptionInput.value : 'normal_output';

            vscode.postMessage({
              type: 'submit',
              payload: { prover: prover , continueOption: continueOption }
            });
          });
        </script>
      </body>
      </html>
    `;

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === 'submit') {
        const userData = message.payload;
        // vscode.window.showInformationMessage(`You selected: ${userData.prover}`);
        // vscode.window.showInformationMessage(`You selected: ${userData.continueOption}`);
        panel.dispose();
        
        const form = new FormData();
        form.append('TPTPProblem', '');
        form.append('ProblemSource', 'FORMULAE');
        form.append('FORMULAEProblem', content);
        form.append('UPLOADProblem', '');
        form.append('FormulaURL', '');
        form.append('CPUPassword', '');
        form.append('AutoModeTimeLimit', '300');
        form.append('QuietFlag', '-q01');
        if (userData.continueOption === 'tptp_format') {
          form.append('X2TPTP', '-S'); // for TPTP format
        }
        else if (userData.continueOption === 'idv_image') {
          form.append('IDV', '-T'); // to continue to IDV
        }
        form.append('AutoMode', '-cE');
        form.append('AutoModeSystemsLimit', '3');
        form.append('Intention', 'THM');
        form.append('ReportFlag', '-q0');
        form.append('SubmitButton', 'RunSelectedSystems');
        form.append('TimeLimit___Alt-Ergo---0.95.2', '60');
        form.append('Transform___Alt-Ergo---0.95.2', 'none');
        form.append('Format___Alt-Ergo---0.95.2', 'tptp:raw');
        form.append('Command___Alt-Ergo---0.95.2', 'run_alt_ergo %d %s');
        form.append('TimeLimit___Beagle---0.9.52', '60');
        form.append('Transform___Beagle---0.9.52', 'none');
        form.append('Format___Beagle---0.9.52', 'tptp:raw');
        form.append('Command___Beagle---0.9.52', 'run_beagle %d %s');
        form.append('TimeLimit___Bliksem---1.12', '60');
        form.append('Transform___Bliksem---1.12', 'none');
        form.append('Format___Bliksem---1.12', 'tptp:raw');
        form.append('Command___Bliksem---1.12', 'run_bliksem %s');
        form.append('TimeLimit___ConnectPP---0.6.0', '60');
        form.append('Transform___ConnectPP---0.6.0', 'none');
        form.append('Format___ConnectPP---0.6.0', 'tptp:raw');
        form.append('Command___ConnectPP---0.6.0', 'connect++ --verbosity 0 --no-colour --tptp-proof --schedule default %s');
        form.append('TimeLimit___CSI_E---1.1', '60');
        form.append('Transform___CSI_E---1.1', 'none');
        form.append('Format___CSI_E---1.1', 'tptp:raw');
        form.append('Command___CSI_E---1.1', 'run_CSI %d %s');
        form.append('TimeLimit___cvc5---1.2.1', '60');
        form.append('Transform___cvc5---1.2.1', 'none');
        form.append('Format___cvc5---1.2.1', 'tptp:raw');
        form.append('Command___cvc5---1.2.1', 'do_cvc5 %s %d THM');
        form.append('TimeLimit___cvc5-SAT---1.2.1', '60');
        form.append('Transform___cvc5-SAT---1.2.1', 'none');
        form.append('Format___cvc5-SAT---1.2.1', 'tptp:raw');
        form.append('Command___cvc5-SAT---1.2.1', 'do_cvc5 %s %d SAT');
        form.append('TimeLimit___Darwin---1.4.5', '60');
        form.append('Transform___Darwin---1.4.5', 'none');
        form.append('Format___Darwin---1.4.5', 'tptp:raw');
        form.append('Command___Darwin---1.4.5', 'darwin -pl 0 -pmc true -to %d %s');
        form.append('TimeLimit___DarwinFM---1.4.5', '60');
        form.append('Transform___DarwinFM---1.4.5', 'none');
        form.append('Format___DarwinFM---1.4.5', 'tptp:raw');
        form.append('Command___DarwinFM---1.4.5', 'darwin -fd true -ppp true -pl 0 -to %d -pmtptp true %s');
        form.append('TimeLimit___DLash---1.11', '60');
        form.append('Transform___DLash---1.11', 'none');
        form.append('Format___DLash---1.11', 'tptp:raw');
        form.append('Command___DLash---1.11', 'run_dlash %d %s');
        form.append('TimeLimit___Drodi---4.1.0', '60');
        form.append('Transform___Drodi---4.1.0', 'none');
        form.append('Format___Drodi---4.1.0', 'tptp:raw');
        form.append('Command___Drodi---4.1.0', 'run_drodi %d %s');
        form.append('TimeLimit___DT2H2X---1.8.4', '60');
        form.append('Transform___DT2H2X---1.8.4', 'none');
        form.append('Format___DT2H2X---1.8.4', 'tptp:raw');
        form.append('Command___DT2H2X---1.8.4', 'run_DT2H2X %s %d Vampire---');
        form.append('TimeLimit___Duper---1.0', '60');
        form.append('Transform___Duper---1.0', 'none');
        form.append('Format___Duper---1.0', 'tptp:raw');
        form.append('Command___Duper---1.0', 'duper %s');
        form.append(`System___${userData.prover}`, userData.prover);
        form.append('TimeLimit___E---3.2.5', '60');
        form.append('Transform___E---3.2.5', 'none');
        form.append('Format___E---3.2.5', 'tptp:raw');
        form.append('Command___E---3.2.5', 'run_E %s %d THM');
        form.append('TimeLimit___E-Darwin---1.5', '60');
        form.append('Transform___E-Darwin---1.5', 'none');
        form.append('Format___E-Darwin---1.5', 'tptp:raw');
        form.append('Command___E-Darwin---1.5', 'e-darwin -pev "TPTP" -pmd true -if tptp -pl 2 -pc false -ps false %s');
        form.append('TimeLimit___E-SAT---3.2.5', '60');
        form.append('Transform___E-SAT---3.2.5', 'none');
        form.append('Format___E-SAT---3.2.5', 'tptp:raw');
        form.append('Command___E-SAT---3.2.5', 'run_E %s %d SAT');
        form.append('TimeLimit___Enigma---0.5.1', '60');
        form.append('Transform___Enigma---0.5.1', 'none');
        form.append('Format___Enigma---0.5.1', 'tptp:raw');
        form.append('Command___Enigma---0.5.1', 'enigmatic-eprover.py %s %d 8');
        form.append('TimeLimit___EQP---0.9e', '60');
        form.append('Transform___EQP---0.9e', 'none');
        form.append('Format___EQP---0.9e', 'tptp:raw');
        form.append('Command___EQP---0.9e', 'tptp2X_and_run_eqp %s');
        form.append('TimeLimit___Equinox---6.0.1a', '60');
        form.append('Transform___Equinox---6.0.1a', 'none');
        form.append('Format___Equinox---6.0.1a', 'tptp:short');
        form.append('Command___Equinox---6.0.1a', 'equinox --modelfile /tmp/model --no-progress --time %d --tstp %s');
        form.append('TimeLimit___Etableau---0.67', '60');
        form.append('Transform___Etableau---0.67', 'none');
        form.append('Format___Etableau---0.67', 'tptp:raw');
        form.append('Command___Etableau---0.67', 'etableau --auto --tsmdo --quicksat=10000 --tableau=1 --tableau-saturation=1 -s -p --tableau-cores=8 --cpu-limit=%d %s');
        form.append('TimeLimit___FEST---2.0.1', '60');
        form.append('Transform___FEST---2.0.1', 'none');
        form.append('Format___FEST---2.0.1', 'tptp:raw');
        form.append('Command___FEST---2.0.1', 'run_fest %s %d');
        form.append('TimeLimit___Geo-III---2018C', '60');
        form.append('Transform___Geo-III---2018C', 'none');
        form.append('Format___Geo-III---2018C', 'tptp:raw');
        form.append('Command___Geo-III---2018C', 'geo -tptp_input -nonempty -include /home/tptp/TPTP -inputfile %s');
        form.append('TimeLimit___GKC---0.8', '60');
        form.append('Transform___GKC---0.8', 'none');
        form.append('Format___GKC---0.8', 'tptp:raw');
        form.append('Command___GKC---0.8', 'gkc %s');
        form.append('TimeLimit___Goeland---1.0.0', '60');
        form.append('Transform___Goeland---1.0.0', 'none');
        form.append('Format___Goeland---1.0.0', 'tptp:raw');
        form.append('Command___Goeland---1.0.0', 'goeland -presko -dmt -proof %s');
        form.append('TimeLimit___GrAnDe---1.1', '60');
        form.append('Transform___GrAnDe---1.1', 'none');
        form.append('Format___GrAnDe---1.1', 'tptp:raw');
        form.append('Command___GrAnDe---1.1', 'And %s %d');
        form.append('TimeLimit___HOLyHammer---0.21', '60');
        form.append('Transform___HOLyHammer---0.21', 'none');
        form.append('Format___HOLyHammer---0.21', 'tptp:raw');
        form.append('Command___HOLyHammer---0.21', 'run_hh %d %s');
        form.append('TimeLimit___Imogen---2.0', '60');
        form.append('Transform___Imogen---2.0', 'stdfof+add_equality');
        form.append('Format___Imogen---2.0', 'tptp');
        form.append('Command___Imogen---2.0', 'imogen fol prove -c -f FileName -s Tptp -pt %s');
        form.append('TimeLimit___Infinox---1.0', '60');
        form.append('Transform___Infinox---1.0', 'none');
        form.append('Format___Infinox---1.0', 'tptp:raw');
        form.append('Command___Infinox---1.0', 'run_infinox %s');
        form.append('TimeLimit___iProver---3.9', '60');
        form.append('Transform___iProver---3.9', 'none');
        form.append('Format___iProver---3.9', 'tptp:raw');
        form.append('Command___iProver---3.9', 'run_iprover %s %d THM');
        form.append('TimeLimit___iProver-Eq---0.85', '60');
        form.append('Transform___iProver-Eq---0.85', 'none');
        form.append('Format___iProver-Eq---0.85', 'tptp:raw');
        form.append('Command___iProver-Eq---0.85', 'run_iprover_eq %d %s');
        form.append('TimeLimit___iProver-SAT---3.9', '60');
        form.append('Transform___iProver-SAT---3.9', 'none');
        form.append('Format___iProver-SAT---3.9', 'tptp:raw');
        form.append('Command___iProver-SAT---3.9', 'run_iprover %s %d SAT');
        form.append('TimeLimit___iProverMo---2.5-0.1', '60');
        form.append('Transform___iProverMo---2.5-0.1', 'none');
        form.append('Format___iProverMo---2.5-0.1', 'tptp:raw');
        form.append('Command___iProverMo---2.5-0.1', 'bin/run_iProverMo %s %d');
        form.append('TimeLimit___Isabelle---2024', '60');
        form.append('Transform___Isabelle---2024', 'none');
        form.append('Format___Isabelle---2024', 'tptp');
        form.append('Command___Isabelle---2024', 'run_isabelle %d %s');
        form.append('TimeLimit___JGXYZ---A3-0.2', '60');
        form.append('Transform___JGXYZ---A3-0.2', 'none');
        form.append('Format___JGXYZ---A3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---A3-0.2', 'jgxyz %s %d a3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDECmi-0.2', '60');
        form.append('Transform___JGXYZ---FDECmi-0.2', 'none');
        form.append('Format___JGXYZ---FDECmi-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDECmi-0.2', 'jgxyz %s %d fdeCmi truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDECon-0.2', '60');
        form.append('Transform___JGXYZ---FDECon-0.2', 'none');
        form.append('Format___JGXYZ---FDECon-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDECon-0.2', 'jgxyz %s %d fdeCon truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDELuk-0.2', '60');
        form.append('Transform___JGXYZ---FDELuk-0.2', 'none');
        form.append('Format___JGXYZ---FDELuk-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDELuk-0.2', 'jgxyz %s %d fdeLuk truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FOF-0.2', '60');
        form.append('Transform___JGXYZ---FOF-0.2', 'none');
        form.append('Format___JGXYZ---FOF-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FOF-0.2', 'jgxyz %s %d fof truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---L3-0.2', '60');
        form.append('Transform___JGXYZ---L3-0.2', 'none');
        form.append('Format___JGXYZ---L3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---L3-0.2', 'jgxyz %s %d l3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---RM3-0.2', '60');
        form.append('Transform___JGXYZ---RM3-0.2', 'none');
        form.append('Format___JGXYZ---RM3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---RM3-0.2', 'jgxyz %s %d rm3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___KSP---0.1.7', '60');
        form.append('Transform___KSP---0.1.7', 'none');
        form.append('Format___KSP---0.1.7', 'tptp:raw');
        form.append('Command___KSP---0.1.7', 'run_ksp %s');
        form.append('TimeLimit___Lash---1.13', '60');
        form.append('Transform___Lash---1.13', 'none');
        form.append('Format___Lash---1.13', 'tptp:raw');
        form.append('Command___Lash---1.13', 'run_lash %d %s');
        form.append('TimeLimit___lazyCoP---0.1', '60');
        form.append('Transform___lazyCoP---0.1', 'none');
        form.append('Format___lazyCoP---0.1', 'tptp:raw');
        form.append('Command___lazyCoP---0.1', 'run_lazyCoP %s');
        form.append('TimeLimit___leanCoP---2.2', '60');
        form.append('Transform___leanCoP---2.2', 'none');
        form.append('Format___leanCoP---2.2', 'tptp:raw');
        form.append('Command___leanCoP---2.2', 'leancop.sh %s %d');
        form.append('TimeLimit___LEO-II---1.7.0', '60');
        form.append('Transform___LEO-II---1.7.0', 'none');
        form.append('Format___LEO-II---1.7.0', 'tptp');
        form.append('Command___LEO-II---1.7.0', 'leo --timeout %d --proofoutput 1 --foatp e --atp e=/home/tptp/Systems/LEO-II---1.7.0/eprover %s');
        form.append('TimeLimit___Leo-III---1.7.18', '60');
        form.append('Transform___Leo-III---1.7.18', 'none');
        form.append('Format___Leo-III---1.7.18', 'tptp:raw');
        form.append('Command___Leo-III---1.7.18', 'run_Leo-III %s %d THM');
        form.append('TimeLimit___Leo-III-SAT---1.7.18', '60');
        form.append('Transform___Leo-III-SAT---1.7.18', 'none');
        form.append('Format___Leo-III-SAT---1.7.18', 'tptp:raw');
        form.append('Command___Leo-III-SAT---1.7.18', 'run_Leo-III %s %d SAT');
        form.append('TimeLimit___Mace4---1109a', '60');
        form.append('Transform___Mace4---1109a', 'none');
        form.append('Format___Mace4---1109a', 'tptp:raw');
        form.append('Command___Mace4---1109a', 'tptp2X_and_run_mace4 %d %s');
        form.append('TimeLimit___MaedMax---1.4', '60');
        form.append('Transform___MaedMax---1.4', 'none');
        form.append('Format___MaedMax---1.4', 'tptp');
        form.append('Command___MaedMax---1.4', 'run_maedmax %d %s');
        form.append('TimeLimit___Matita---1.0', '60');
        form.append('Transform___Matita---1.0', 'none');
        form.append('Format___Matita---1.0', 'tptp:raw');
        form.append('Command___Matita---1.0', 'matitaprover --timeout %d --tptppath /home/tptp/TPTP %s');
        form.append('TimeLimit___Metis---2.4', '60');
        form.append('Transform___Metis---2.4', 'none');
        form.append('Format___Metis---2.4', 'tptp:raw');
        form.append('Command___Metis---2.4', 'metis --show proof --show saturation %s');
        form.append('TimeLimit___Moca---0.1', '60');
        form.append('Transform___Moca---0.1', 'none');
        form.append('Format___Moca---0.1', 'tptp:raw');
        form.append('Command___Moca---0.1', 'moca.sh %s');
        form.append('TimeLimit___Muscadet---4.5', '60');
        form.append('Transform___Muscadet---4.5', 'none');
        form.append('Format___Muscadet---4.5', 'tptp:raw');
        form.append('Command___Muscadet---4.5', 'muscadet %s');
        form.append('TimeLimit___nanoCoP---2.0', '60');
        form.append('Transform___nanoCoP---2.0', 'none');
        form.append('Format___nanoCoP---2.0', 'tptp:raw');
        form.append('Command___nanoCoP---2.0', 'nanocop.sh %s %d');
        form.append('TimeLimit___Otter---3.3', '60');
        form.append('Transform___Otter---3.3', 'none');
        form.append('Format___Otter---3.3', 'tptp:raw');
        form.append('Command___Otter---3.3', 'otter-tptp-script %s');
        form.append('TimeLimit___Paradox---4.0', '60');
        form.append('Transform___Paradox---4.0', 'none');
        form.append('Format___Paradox---4.0', 'tptp:short');
        form.append('Command___Paradox---4.0', 'paradox --no-progress --time %d --tstp --model %s');
        form.append('TimeLimit___Princess---230619', '60');
        form.append('Transform___Princess---230619', 'none');
        form.append('Format___Princess---230619', 'tptp');
        form.append('Command___Princess---230619', 'princess -inputFormat=tptp +threads -portfolio=casc +printProof -timeoutSec=%d %s');
        form.append('TimeLimit___Prover9---1109a', '60');
        form.append('Transform___Prover9---1109a', 'none');
        form.append('Format___Prover9---1109a', 'tptp:raw');
        form.append('Command___Prover9---1109a', 'tptp2X_and_run_prover9 %d %s');
        form.append('TimeLimit___PyRes---1.5', '60');
        form.append('Transform___PyRes---1.5', 'none');
        form.append('Format___PyRes---1.5', 'tptp:raw');
        form.append('Command___PyRes---1.5', 'pyres-fof.py -tifbsVp -nlargest -HPickGiven5 %s');
        form.append('TimeLimit___RPx---1.0', '60');
        form.append('Transform___RPx---1.0', 'none');
        form.append('Format___RPx---1.0', 'tptp:raw');
        form.append('Command___RPx---1.0', 'run_RPx %s');
        form.append('TimeLimit___Satallax---3.5', '60');
        form.append('Transform___Satallax---3.5', 'none');
        form.append('Format___Satallax---3.5', 'tptp:raw');
        form.append('Command___Satallax---3.5', 'run_satallax %d %s');
        form.append('TimeLimit___SATCoP---0.1', '60');
        form.append('Transform___SATCoP---0.1', 'none');
        form.append('Format___SATCoP---0.1', 'tptp:raw');
        form.append('Command___SATCoP---0.1', 'satcop --statistics %s');
        form.append('TimeLimit___Scavenger---EP-0.2', '60');
        form.append('Transform___Scavenger---EP-0.2', 'none');
        form.append('Format___Scavenger---EP-0.2', 'tptp:raw');
        form.append('Command___Scavenger---EP-0.2', 'run_scavenger %s');
        form.append('TimeLimit___SnakeForV---1.0', '60');
        form.append('Transform___SnakeForV---1.0', 'none');
        form.append('Format___SnakeForV---1.0', 'tptp:raw');
        form.append('Command___SnakeForV---1.0', 'vampire --input_syntax tptp --proof tptp --output_axiom_names on --mode portfolio --schedule snake_tptp_uns --cores 0 -t %d %s');
        form.append('TimeLimit___SnakeForV-SAT---1.0', '60');
        form.append('Transform___SnakeForV-SAT---1.0', 'none');
        form.append('Format___SnakeForV-SAT---1.0', 'tptp:raw');
        form.append('Command___SnakeForV-SAT---1.0', 'vampire --input_syntax tptp --proof tptp --output_axiom_names on --mode portfolio --schedule snake_tptp_sat --cores 0 -t %d %s');
        form.append('TimeLimit___SNARK---20120808r022', '60');
        form.append('Transform___SNARK---20120808r022', 'none');
        form.append('Format___SNARK---20120808r022', 'tptp:raw');
        form.append('Command___SNARK---20120808r022', 'run-snark %s %d');
        form.append('TimeLimit___SPASS+T---2.2.22', '60');
        form.append('Transform___SPASS+T---2.2.22', 'none');
        form.append('Format___SPASS+T---2.2.22', 'tptp:raw');
        form.append('Command___SPASS+T---2.2.22', 'spasst-tptp-script %s %d');
        form.append('TimeLimit___SPASS---3.9', '60');
        form.append('Transform___SPASS---3.9', 'none');
        form.append('Format___SPASS---3.9', 'tptp');
        form.append('Command___SPASS---3.9', 'run_spass %d %s');
        form.append('TimeLimit___SRASS---0.1', '60');
        form.append('Transform___SRASS---0.1', 'none');
        form.append('Format___SRASS---0.1', 'tptp:raw');
        form.append('Command___SRASS---0.1', 'SRASS -q2 -a 0 10 10 10 -i3 -n60 %s');
        form.append('TimeLimit___ToFoF---0.1', '60');
        form.append('Transform___ToFoF---0.1', 'none');
        form.append('Format___ToFoF---0.1', 'tptp:raw');
        form.append('Command___ToFoF---0.1', 'tofof %d %s');
        form.append('TimeLimit___ToFoF-SAT---0.1', '60');
        form.append('Transform___ToFoF-SAT---0.1', 'none');
        form.append('Format___ToFoF-SAT---0.1', 'tptp:raw');
        form.append('Command___ToFoF-SAT---0.1', 'tofof %d %s --model');
        form.append('TimeLimit___Toma---0.4', '60');
        form.append('Transform___Toma---0.4', 'none');
        form.append('Format___Toma---0.4', 'tptp:raw');
        form.append('Command___Toma---0.4', 'run_toma %s');
        form.append('TimeLimit___Twee---2.5.0', '60');
        form.append('Transform___Twee---2.5.0', 'none');
        form.append('Format___Twee---2.5.0', 'tptp:raw');
        form.append('Command___Twee---2.5.0', 'parallel-twee %s --tstp --conditional-encoding if --smaller --drop-non-horn --give-up-on-saturation --explain-encoding --formal-proof');
        form.append('TimeLimit___Vampire---4.9', '60');
        form.append('Transform___Vampire---4.9', 'none');
        form.append('Format___Vampire---4.9', 'tptp:raw');
        form.append('Command___Vampire---4.9', 'run_vampire %s %d THM');
        form.append('TimeLimit___Vampire-FMo---4.9', '60');
        form.append('Transform___Vampire-FMo---4.9', 'none');
        form.append('Format___Vampire-FMo---4.9', 'tptp:raw');
        form.append('Command___Vampire-FMo---4.9', 'vampire %s -t %d -sa fmb -qa off');
        form.append('TimeLimit___Vampire-SAT---4.9', '60');
        form.append('Transform___Vampire-SAT---4.9', 'none');
        form.append('Format___Vampire-SAT---4.9', 'tptp:raw');
        form.append('Command___Vampire-SAT---4.9', 'run_vampire %s %d SAT');
        form.append('TimeLimit___VampireLite---4.9', '60');
        form.append('Transform___VampireLite---4.9', 'none');
        form.append('Format___VampireLite---4.9', 'tptp:raw');
        form.append('Command___VampireLite---4.9', 'run_vampire %s %d LITE');
        form.append('TimeLimit___Waldmeister---710', '60');
        form.append('Transform___Waldmeister---710', 'none');
        form.append('Format___Waldmeister---710', 'tptp:raw');
        form.append('Command___Waldmeister---710', 'woody %s');
        form.append('TimeLimit___Z3---4.15.1', '60');
        form.append('Transform___Z3---4.15.1', 'none');
        form.append('Format___Z3---4.15.1', 'tptp');
        form.append('Command___Z3---4.15.1', 'run_z3 -proof -model -t:%d -file:%s');
        form.append('TimeLimit___Zenon---0.7.1', '60');
        form.append('Transform___Zenon---0.7.1', 'none');
        form.append('Format___Zenon---0.7.1', 'tptp:raw');
        form.append('Command___Zenon---0.7.1', 'run_zenon %s %d');
        form.append('TimeLimit___ZenonModulo---0.5.0', '60');
        form.append('Transform___ZenonModulo---0.5.0', 'none');
        form.append('Format___ZenonModulo---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModulo---0.5.0', 'run_zenon_modulo %d %s NONE');
        form.append('TimeLimit___ZenonModuloDK---0.5.0', '60');
        form.append('Transform___ZenonModuloDK---0.5.0', 'none');
        form.append('Format___ZenonModuloDK---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModuloDK---0.5.0', 'run_zenon_modulo %d %s DK');
        form.append('TimeLimit___ZenonModuloLP---0.5.0', '60');
        form.append('Transform___ZenonModuloLP---0.5.0', 'none');
        form.append('Format___ZenonModuloLP---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModuloLP---0.5.0', 'run_zenon_modulo %d %s LP');
        form.append('TimeLimit___Zipperpin---2.1', '60');
        form.append('Transform___Zipperpin---2.1', 'none');
        form.append('Format___Zipperpin---2.1', 'tptp:raw');
        form.append('Command___Zipperpin---2.1', 'run_zipperposition %s %d');

        try {
          fetch("https://tptp.org/cgi-bin/SystemOnTPTPFormReply", {
            method: 'POST',
            body: form,
          })
          .then(response => response.text())
          .then(html => {
            const resultHtml = html;

            const resultPanel = vscode.window.createWebviewPanel(
              'tptpResult',
              'TPTP Result',
              vscode.ViewColumn.Two,
              { enableScripts: true }
            );

            resultPanel.webview.html = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>TPTP Prover Result</title>
                <style>
                  .collapsable button { background-color: var(--vscode-activityBar-border) } 
                  h1 { text-decoration: underline; }
                  h2 { color: var(--vscode-editorLightBulb-foreground); }
                  pre { line-height: 20px; }
                  body { margin: 20px !important; }
                  span { background-color: var(--vscode-toolbar-hoverBackground); padding: 5px; border-radius: 10px; }
                  button {
                    align-items: center;
                    appearance: button;
                    background-color: var(--vscode-focusBorder);
                    border-radius: 8px;
                    border-style: none;
                    box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    flex-shrink: 0;
                    font-family: "Segoe UI", sans-serif;
                    font-size: 100%;
                    line-height: 1.15;
                    margin: 0;
                    padding: 10px 13px;
                    text-align: center;
                    text-transform: none;
                    transition:
                      color 0.13s ease-in-out,
                      background 0.13s ease-in-out,
                      opacity 0.13s ease-in-out,
                      box-shadow 0.13s ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                  }
                </style>
              </head>
              <body>
                <h1>TPTP Prover Result</h1>
                <h2>Prover: <span>${userData.prover}</span></h2>

                ${userData.continueOption === "tptp_format" ? `<button onclick="downloadResult()">Download Solution</button>` : ``}
                
                ${resultHtml.replace('Loading IDV ... ', '')}

                <script>
                  const vscode = acquireVsCodeApi();
                  function downloadResult() {
                    const content = document.querySelector('pre').innerText;
                    vscode.postMessage({command: 'download', content: content});
                  }
                </script>
              </body>
              </html>
            `;

            resultPanel.webview.onDidReceiveMessage(async (message) => {
              if (message.command === 'download') {
                const content = message.content;

                const docDir = path.dirname(doc.uri.fsPath);
                const docBase = path.basename(doc.uri.fsPath);
                const defaultName = `${docBase.split(".")[0]}.s`;
                let finalUri = vscode.Uri.file(path.join(docDir, defaultName));

                try {
                  // Check if file exists
                  await vscode.workspace.fs.stat(finalUri);

                  const choice = await vscode.window.showQuickPick(
                    ['Replace', 'Keep Both', 'Cancel'],
                    { placeHolder: `File "${defaultName}" already exists. What do you want to do?` }
                  );

                  if (choice === 'Cancel' || !choice) return;

                  if (choice === 'Keep Both') {
                    let counter = 1;
                    while (true) {
                      const candidatePath = path.join(docDir, `${docBase.split(".")[0]} (${counter}).s`);
                      const candidateUri = vscode.Uri.file(candidatePath);
                      try {
                        await vscode.workspace.fs.stat(candidateUri);
                        counter++;
                      } catch {
                        finalUri = candidateUri;
                        break;
                      }
                    }
                  }
                  // If Replace, proceed with original finalUri

                } catch {
                  // File does not exist — safe to use finalUri
                }

                const data = new TextEncoder().encode(content);
                await vscode.workspace.fs.writeFile(finalUri, data);
                vscode.window.showInformationMessage(`Saved to ${finalUri.fsPath}`);
              }
            });

          })
          .catch(error => {
              console.error('Fetch error:', error);
          });

        } catch (error: any) {
          vscode.window.showErrorMessage(`Error submitting to TPTP: ${error.message}`);
        }
      }
    });

  });

  context.subscriptions.push(proveProblem);

  //@                                                                                     


  //@ RUN A THEOREM (USING MULTIPLE PROVERS)                                              
  const proveProblemMultiple = vscode.commands.registerCommand('tptp.proveProblemMultiple', async (uri: vscode.Uri) => {
    const doc = await vscode.workspace.openTextDocument(uri);
    const content = doc.getText();

    const panel = vscode.window.createWebviewPanel(
      'customMenu',
      'TPTP Provers Options',
      vscode.ViewColumn.Two,
      { enableScripts: true }  // allow JS
    );

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>TPTP Provers</title>
        <style>
          .collapsable button { background-color: var(--vscode-activityBar-border) } 
          body {
            font-family: "Inter", sans-serif;
          }

          h1 { 
            text-decoration: underline; 
          }

          label {
            display: flex;
            cursor: pointer;
            font-weight: 500;
            position: relative;
            overflow: hidden;
            margin-bottom: 0.375em;
          }

          label input {
            position: absolute;
            left: -9999px;
          }

          label input:checked + span {
            background-color: var(--vscode-button-background);
          }

          label input:checked + span:before {
            box-shadow: inset 0 0 0 0.4375em #00005c;
          }

          label span {
            display: flex;
            align-items: center;
            padding: 0.375em 0.75em 0.375em 0.375em;
            border-radius: 99em;
            transition: 0.25s ease;
          }

          label span:hover {
            background-color: var(--vscode-button-hoverBackground);
          }

          label span:before {
            display: flex;
            flex-shrink: 0;
            content: "";
            background-color: #fff;
            width: 1.5em;
            height: 1.5em;
            border-radius: 50%;
            margin-right: 0.375em;
            transition: 0.25s ease;
            box-shadow: inset 0 0 0 0.125em #00005c;
          }

          .submit-btn {
            align-items: center;
            appearance: button;
            background-color: var(--vscode-focusBorder);
            border-radius: 8px;
            border-style: none;
            box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
            box-sizing: border-box;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            flex-shrink: 0;
            font-family: "Segoe UI", sans-serif;
            font-size: 100%;
            line-height: 1.15;
            margin: 0;
            padding: 10px 21px;
            text-align: center;
            text-transform: none;
            transition:
              color 0.13s ease-in-out,
              background 0.13s ease-in-out,
              opacity 0.13s ease-in-out,
              box-shadow 0.13s ease-in-out;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }

          .filename-txt {
            color: var(--vscode-editorLightBulb-foreground);
          }

          form { line-height: 20px; }
        </style>
      </head>
      <body>
        <h1>Run TPTP Provers</h1>
        <p class="filename-txt">File: ${path.basename(doc.uri.fsPath)}</p>

        <form id="optionForm">
          <h2>Select the Provers</h2>
          <label> <input type="radio" name="prover" value="agsyHOL---1.0"> <span>agsyHOL 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Alt-Ergo---0.95.2"> <span>Alt-Ergo 0.95.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="Beagle---0.9.52"> <span>Beagle 0.9.52</span> <br> </label>
          <label> <input type="radio" name="prover" value="Bliksem---1.12"> <span>Bliksem 1.12</span> <br> </label>
          <label> <input type="radio" name="prover" value="ConnectPP---0.6.0"> <span>ConnectPP 0.6.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="CSE_E---1.6"> <span>CSE_E 1.6</span> <br> </label>
          <label> <input type="radio" name="prover" value="CSI_E---1.1"> <span>CSI_E 1.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="cvc5---1.2.1"> <span>cvc5 1.2.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="cvc5-SAT---1.2.1"> <span>cvc5-SAT 1.2.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Darwin---1.4.5"> <span>Darwin 1.4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="DarwinFM---1.4.5"> <span>DarwinFM 1.4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="DLash---1.11"> <span>DLash 1.11</span> <br> </label>
          <label> <input type="radio" name="prover" value="Drodi---4.1.0"> <span>Drodi 4.1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="DT2H2X---1.8.4"> <span>DT2H2X 1.8.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Duper---1.0"> <span>Duper 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="E---3.2.5"> <span>E 3.2.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="E-SAT---3.2.5"> <span>E-SAT 3.2.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="Enigma---0.5.1"> <span>Enigma 0.5.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Etableau---0.67"> <span>Etableau 0.67</span> <br> </label>
          <label> <input type="radio" name="prover" value="E-Darwin---1.5"> <span>E-Darwin 1.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="EQP---0.9e"> <span>EQP 0.9e</span> <br> </label>
          <label> <input type="radio" name="prover" value="Equinox---6.0.1a"> <span>Equinox 6.0.1a</span> <br> </label>
          <label> <input type="radio" name="prover" value="FEST---2.0.1"> <span>FEST 2.0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Geo-III---2018C"> <span>Geo-III 2018C</span> <br> </label>
          <label> <input type="radio" name="prover" value="Goeland---1.0.0"> <span>Goeland 1.0.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="GKC---0.8"> <span>GKC 0.8</span> <br> </label>
          <label> <input type="radio" name="prover" value="GrAnDe---1.1"> <span>GrAnDe 1.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="HOLyHammer---0.21"> <span>HOLyHammer 0.21</span> <br> </label>
          <label> <input type="radio" name="prover" value="Imogen---2.0"> <span>Imogen 2.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Infinox---1.0"> <span>Infinox 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver---3.9"> <span>iProver 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver-SAT---3.9"> <span>iProver-SAT 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProverMo---2.5-0.1"> <span>iProverMo 2.5-0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="iProver-Eq---0.85"> <span>iProver-Eq 0.85</span> <br> </label>
          <label> <input type="radio" name="prover" value="Isabelle---2024"> <span>Isabelle 2024</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---A3-0.2"> <span>JGXYZ A3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDECmi-0.2"> <span>JGXYZ FDECmi-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDECon-0.2"> <span>JGXYZ FDECon-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FDELuk-0.2"> <span>JGXYZ FDELuk-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---FOF-0.2"> <span>JGXYZ FOF-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---L3-0.2"> <span>JGXYZ L3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="JGXYZ---RM3-0.2"> <span>JGXYZ RM3-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="KSP---0.1.7"> <span>KSP 0.1.7</span> <br> </label>
          <label> <input type="radio" name="prover" value="Lash---1.13"> <span>Lash 1.13</span> <br> </label>
          <label> <input type="radio" name="prover" value="lazyCoP---0.1"> <span>lazyCoP 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="leanCoP---2.2"> <span>leanCoP 2.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="LEO-II---1.7.0"> <span>LEO-II 1.7.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Leo-III---1.7.19"> <span>Leo-III 1.7.19</span> <br> </label>
          <label> <input type="radio" name="prover" value="Leo-III-SAT---1.7.19"> <span>Leo-III-SAT 1.7.19</span> <br> </label>
          <label> <input type="radio" name="prover" value="Mace4---1109a"> <span>Mace4 1109a</span> <br> </label>
          <label> <input type="radio" name="prover" value="MaedMax---1.4"> <span>MaedMax 1.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Matita---1.0"> <span>Matita 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Metis---2.4"> <span>Metis 2.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="Moca---0.1"> <span>Moca 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Muscadet---4.5"> <span>Muscadet 4.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="nanoCoP---2.0"> <span>nanoCoP 2.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Nitpick---2024"> <span>Nitpick 2024</span> <br> </label>
          <label> <input type="radio" name="prover" value="Otter---3.3"> <span>Otter 3.3</span> <br> </label>
          <label> <input type="radio" name="prover" value="Paradox---4.0"> <span>Paradox 4.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Princess---230619"> <span>Princess 230619</span> <br> </label>
          <label> <input type="radio" name="prover" value="Prover9---1109a"> <span>Prover9 1109a</span> <br> </label>
          <label> <input type="radio" name="prover" value="PyRes---1.5"> <span>PyRes 1.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="RPx---1.0"> <span>RPx 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Satallax---3.5"> <span>Satallax 3.5</span> <br> </label>
          <label> <input type="radio" name="prover" value="SATCoP---0.1"> <span>SATCoP 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Scavenger---EP-0.2"> <span>Scavenger EP-0.2</span> <br> </label>
          <label> <input type="radio" name="prover" value="SnakeForV---1.0"> <span>SnakeForV 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="SnakeForV-SAT---1.0"> <span>SnakeForV-SAT 1.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="SNARK---20120808r022"> <span>SNARK 20120808r022</span> <br> </label>
          <label> <input type="radio" name="prover" value="SPASS---3.9"> <span>SPASS 3.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="SPASS+T---2.2.22"> <span>SPASS+T 2.2.22</span> <br> </label>
          <label> <input type="radio" name="prover" value="SRASS---0.1"> <span>SRASS 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ToFoF---0.1"> <span>ToFoF 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ToFoF-SAT---0.1"> <span>ToFoF-SAT 0.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Toma---0.4"> <span>Toma 0.4</span> <br> </label>
          <label> <input type="radio" name="prover" value="TPS---3.120601S1b"> <span>TPS 3.120601S1b</span> <br> </label>
          <label> <input type="radio" name="prover" value="Twee---2.5.0"> <span>Twee 2.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire---4.9"> <span>Vampire 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire-SAT---4.9"> <span>Vampire-SAT 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="VampireLite---4.9"> <span>VampireLite 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Vampire-FMo---4.9"> <span>Vampire-FMo 4.9</span> <br> </label>
          <label> <input type="radio" name="prover" value="Waldmeister---710"> <span>Waldmeister 710</span> <br> </label>
          <label> <input type="radio" name="prover" value="Z3---4.15.1"> <span>Z3 4.15.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="Zenon---0.7.1"> <span>Zenon 0.7.1</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModulo---0.5.0"> <span>ZenonModulo 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModuloLP---0.5.0"> <span>ZenonModuloLP 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="ZenonModuloDK---0.5.0"> <span>ZenonModuloDK 0.5.0</span> <br> </label>
          <label> <input type="radio" name="prover" value="Zipperpin---2.1"> <span>Zipperpin 2.1</span> <br> </label>
          <br>

          <h2>Continue to</h2>
          <label> <input type="radio" name="continueOption" value="normal_output"> <span>Normal Output</span> <br> </label>
          <label> <input type="radio" name="continueOption" value="tptp_format"> <span>TPTP Format</span> <br> </label>
          <br>

          <button class="submit-btn" type="submit">Prove</button>
          </form>
        <br><br><br><br>

        <script>
          const vscode = acquireVsCodeApi();

          document.getElementById('optionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const proversInput = document.querySelectorAll('input[type="checkbox"]:checked');
            const provers = proversInput ? Array.from(proversInput).map(inp => inp.value) : null;

            const continueOptionInput = document.querySelector('input[name="continueOption"]:checked');
            const continueOption = continueOptionInput ? continueOptionInput.value : 'normal_output';

            vscode.postMessage({
              type: 'submit',
              payload: { provers: provers , continueOption: continueOption }
            });
          });
        </script>
      </body>
      </html>
    `;

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === 'submit') {
        const userData = message.payload;
        // vscode.window.showInformationMessage(`You selected: ${userData.provers}`);
        // vscode.window.showInformationMessage(`You selected: ${userData.continueOption}`);
        panel.dispose();
        
        const form = new FormData();
        form.append('TPTPProblem', '');
        form.append('ProblemSource', 'FORMULAE');
        form.append('FORMULAEProblem', content);
        form.append('UPLOADProblem', '');
        form.append('FormulaURL', '');
        form.append('CPUPassword', '');
        form.append('AutoModeTimeLimit', '300');
        form.append('QuietFlag', '-q01');

        if (userData.continueOption === 'tptp_format') {
          form.append('X2TPTP', '-S'); // for TPTP format
        }

        for (const prover of userData.provers) {
          form.append(`System___${prover}`, prover);
        }
        
        form.append('AutoMode', '-cE');
        form.append('AutoModeSystemsLimit', '3');
        form.append('Intention', 'THM');
        form.append('ReportFlag', '-q0');
        form.append('SubmitButton', 'RunSelectedSystems');
        form.append('TimeLimit___Alt-Ergo---0.95.2', '60');
        form.append('Transform___Alt-Ergo---0.95.2', 'none');
        form.append('Format___Alt-Ergo---0.95.2', 'tptp:raw');
        form.append('Command___Alt-Ergo---0.95.2', 'run_alt_ergo %d %s');
        form.append('TimeLimit___Beagle---0.9.52', '60');
        form.append('Transform___Beagle---0.9.52', 'none');
        form.append('Format___Beagle---0.9.52', 'tptp:raw');
        form.append('Command___Beagle---0.9.52', 'run_beagle %d %s');
        form.append('TimeLimit___Bliksem---1.12', '60');
        form.append('Transform___Bliksem---1.12', 'none');
        form.append('Format___Bliksem---1.12', 'tptp:raw');
        form.append('Command___Bliksem---1.12', 'run_bliksem %s');
        form.append('TimeLimit___ConnectPP---0.6.0', '60');
        form.append('Transform___ConnectPP---0.6.0', 'none');
        form.append('Format___ConnectPP---0.6.0', 'tptp:raw');
        form.append('Command___ConnectPP---0.6.0', 'connect++ --verbosity 0 --no-colour --tptp-proof --schedule default %s');
        form.append('TimeLimit___CSI_E---1.1', '60');
        form.append('Transform___CSI_E---1.1', 'none');
        form.append('Format___CSI_E---1.1', 'tptp:raw');
        form.append('Command___CSI_E---1.1', 'run_CSI %d %s');
        form.append('TimeLimit___cvc5---1.2.1', '60');
        form.append('Transform___cvc5---1.2.1', 'none');
        form.append('Format___cvc5---1.2.1', 'tptp:raw');
        form.append('Command___cvc5---1.2.1', 'do_cvc5 %s %d THM');
        form.append('TimeLimit___cvc5-SAT---1.2.1', '60');
        form.append('Transform___cvc5-SAT---1.2.1', 'none');
        form.append('Format___cvc5-SAT---1.2.1', 'tptp:raw');
        form.append('Command___cvc5-SAT---1.2.1', 'do_cvc5 %s %d SAT');
        form.append('TimeLimit___Darwin---1.4.5', '60');
        form.append('Transform___Darwin---1.4.5', 'none');
        form.append('Format___Darwin---1.4.5', 'tptp:raw');
        form.append('Command___Darwin---1.4.5', 'darwin -pl 0 -pmc true -to %d %s');
        form.append('TimeLimit___DarwinFM---1.4.5', '60');
        form.append('Transform___DarwinFM---1.4.5', 'none');
        form.append('Format___DarwinFM---1.4.5', 'tptp:raw');
        form.append('Command___DarwinFM---1.4.5', 'darwin -fd true -ppp true -pl 0 -to %d -pmtptp true %s');
        form.append('TimeLimit___DLash---1.11', '60');
        form.append('Transform___DLash---1.11', 'none');
        form.append('Format___DLash---1.11', 'tptp:raw');
        form.append('Command___DLash---1.11', 'run_dlash %d %s');
        form.append('TimeLimit___Drodi---4.1.0', '60');
        form.append('Transform___Drodi---4.1.0', 'none');
        form.append('Format___Drodi---4.1.0', 'tptp:raw');
        form.append('Command___Drodi---4.1.0', 'run_drodi %d %s');
        form.append('TimeLimit___DT2H2X---1.8.4', '60');
        form.append('Transform___DT2H2X---1.8.4', 'none');
        form.append('Format___DT2H2X---1.8.4', 'tptp:raw');
        form.append('Command___DT2H2X---1.8.4', 'run_DT2H2X %s %d Vampire---');
        form.append('TimeLimit___Duper---1.0', '60');
        form.append('Transform___Duper---1.0', 'none');
        form.append('Format___Duper---1.0', 'tptp:raw');
        form.append('Command___Duper---1.0', 'duper %s');
        form.append('TimeLimit___E---3.2.5', '60');
        form.append('Transform___E---3.2.5', 'none');
        form.append('Format___E---3.2.5', 'tptp:raw');
        form.append('Command___E---3.2.5', 'run_E %s %d THM');
        form.append('TimeLimit___E-Darwin---1.5', '60');
        form.append('Transform___E-Darwin---1.5', 'none');
        form.append('Format___E-Darwin---1.5', 'tptp:raw');
        form.append('Command___E-Darwin---1.5', 'e-darwin -pev "TPTP" -pmd true -if tptp -pl 2 -pc false -ps false %s');
        form.append('TimeLimit___E-SAT---3.2.5', '60');
        form.append('Transform___E-SAT---3.2.5', 'none');
        form.append('Format___E-SAT---3.2.5', 'tptp:raw');
        form.append('Command___E-SAT---3.2.5', 'run_E %s %d SAT');
        form.append('TimeLimit___Enigma---0.5.1', '60');
        form.append('Transform___Enigma---0.5.1', 'none');
        form.append('Format___Enigma---0.5.1', 'tptp:raw');
        form.append('Command___Enigma---0.5.1', 'enigmatic-eprover.py %s %d 8');
        form.append('TimeLimit___EQP---0.9e', '60');
        form.append('Transform___EQP---0.9e', 'none');
        form.append('Format___EQP---0.9e', 'tptp:raw');
        form.append('Command___EQP---0.9e', 'tptp2X_and_run_eqp %s');
        form.append('TimeLimit___Equinox---6.0.1a', '60');
        form.append('Transform___Equinox---6.0.1a', 'none');
        form.append('Format___Equinox---6.0.1a', 'tptp:short');
        form.append('Command___Equinox---6.0.1a', 'equinox --modelfile /tmp/model --no-progress --time %d --tstp %s');
        form.append('TimeLimit___Etableau---0.67', '60');
        form.append('Transform___Etableau---0.67', 'none');
        form.append('Format___Etableau---0.67', 'tptp:raw');
        form.append('Command___Etableau---0.67', 'etableau --auto --tsmdo --quicksat=10000 --tableau=1 --tableau-saturation=1 -s -p --tableau-cores=8 --cpu-limit=%d %s');
        form.append('TimeLimit___FEST---2.0.1', '60');
        form.append('Transform___FEST---2.0.1', 'none');
        form.append('Format___FEST---2.0.1', 'tptp:raw');
        form.append('Command___FEST---2.0.1', 'run_fest %s %d');
        form.append('TimeLimit___Geo-III---2018C', '60');
        form.append('Transform___Geo-III---2018C', 'none');
        form.append('Format___Geo-III---2018C', 'tptp:raw');
        form.append('Command___Geo-III---2018C', 'geo -tptp_input -nonempty -include /home/tptp/TPTP -inputfile %s');
        form.append('TimeLimit___GKC---0.8', '60');
        form.append('Transform___GKC---0.8', 'none');
        form.append('Format___GKC---0.8', 'tptp:raw');
        form.append('Command___GKC---0.8', 'gkc %s');
        form.append('TimeLimit___Goeland---1.0.0', '60');
        form.append('Transform___Goeland---1.0.0', 'none');
        form.append('Format___Goeland---1.0.0', 'tptp:raw');
        form.append('Command___Goeland---1.0.0', 'goeland -presko -dmt -proof %s');
        form.append('TimeLimit___GrAnDe---1.1', '60');
        form.append('Transform___GrAnDe---1.1', 'none');
        form.append('Format___GrAnDe---1.1', 'tptp:raw');
        form.append('Command___GrAnDe---1.1', 'And %s %d');
        form.append('TimeLimit___HOLyHammer---0.21', '60');
        form.append('Transform___HOLyHammer---0.21', 'none');
        form.append('Format___HOLyHammer---0.21', 'tptp:raw');
        form.append('Command___HOLyHammer---0.21', 'run_hh %d %s');
        form.append('TimeLimit___Imogen---2.0', '60');
        form.append('Transform___Imogen---2.0', 'stdfof+add_equality');
        form.append('Format___Imogen---2.0', 'tptp');
        form.append('Command___Imogen---2.0', 'imogen fol prove -c -f FileName -s Tptp -pt %s');
        form.append('TimeLimit___Infinox---1.0', '60');
        form.append('Transform___Infinox---1.0', 'none');
        form.append('Format___Infinox---1.0', 'tptp:raw');
        form.append('Command___Infinox---1.0', 'run_infinox %s');
        form.append('TimeLimit___iProver---3.9', '60');
        form.append('Transform___iProver---3.9', 'none');
        form.append('Format___iProver---3.9', 'tptp:raw');
        form.append('Command___iProver---3.9', 'run_iprover %s %d THM');
        form.append('TimeLimit___iProver-Eq---0.85', '60');
        form.append('Transform___iProver-Eq---0.85', 'none');
        form.append('Format___iProver-Eq---0.85', 'tptp:raw');
        form.append('Command___iProver-Eq---0.85', 'run_iprover_eq %d %s');
        form.append('TimeLimit___iProver-SAT---3.9', '60');
        form.append('Transform___iProver-SAT---3.9', 'none');
        form.append('Format___iProver-SAT---3.9', 'tptp:raw');
        form.append('Command___iProver-SAT---3.9', 'run_iprover %s %d SAT');
        form.append('TimeLimit___iProverMo---2.5-0.1', '60');
        form.append('Transform___iProverMo---2.5-0.1', 'none');
        form.append('Format___iProverMo---2.5-0.1', 'tptp:raw');
        form.append('Command___iProverMo---2.5-0.1', 'bin/run_iProverMo %s %d');
        form.append('TimeLimit___Isabelle---2024', '60');
        form.append('Transform___Isabelle---2024', 'none');
        form.append('Format___Isabelle---2024', 'tptp');
        form.append('Command___Isabelle---2024', 'run_isabelle %d %s');
        form.append('TimeLimit___JGXYZ---A3-0.2', '60');
        form.append('Transform___JGXYZ---A3-0.2', 'none');
        form.append('Format___JGXYZ---A3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---A3-0.2', 'jgxyz %s %d a3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDECmi-0.2', '60');
        form.append('Transform___JGXYZ---FDECmi-0.2', 'none');
        form.append('Format___JGXYZ---FDECmi-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDECmi-0.2', 'jgxyz %s %d fdeCmi truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDECon-0.2', '60');
        form.append('Transform___JGXYZ---FDECon-0.2', 'none');
        form.append('Format___JGXYZ---FDECon-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDECon-0.2', 'jgxyz %s %d fdeCon truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FDELuk-0.2', '60');
        form.append('Transform___JGXYZ---FDELuk-0.2', 'none');
        form.append('Format___JGXYZ---FDELuk-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FDELuk-0.2', 'jgxyz %s %d fdeLuk truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---FOF-0.2', '60');
        form.append('Transform___JGXYZ---FOF-0.2', 'none');
        form.append('Format___JGXYZ---FOF-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---FOF-0.2', 'jgxyz %s %d fof truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---L3-0.2', '60');
        form.append('Transform___JGXYZ---L3-0.2', 'none');
        form.append('Format___JGXYZ---L3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---L3-0.2', 'jgxyz %s %d l3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___JGXYZ---RM3-0.2', '60');
        form.append('Transform___JGXYZ---RM3-0.2', 'none');
        form.append('Format___JGXYZ---RM3-0.2', 'tptp:raw');
        form.append('Command___JGXYZ---RM3-0.2', 'jgxyz %s %d rm3 truth_evaluation designated vampire 80 vampirefmo 20');
        form.append('TimeLimit___KSP---0.1.7', '60');
        form.append('Transform___KSP---0.1.7', 'none');
        form.append('Format___KSP---0.1.7', 'tptp:raw');
        form.append('Command___KSP---0.1.7', 'run_ksp %s');
        form.append('TimeLimit___Lash---1.13', '60');
        form.append('Transform___Lash---1.13', 'none');
        form.append('Format___Lash---1.13', 'tptp:raw');
        form.append('Command___Lash---1.13', 'run_lash %d %s');
        form.append('TimeLimit___lazyCoP---0.1', '60');
        form.append('Transform___lazyCoP---0.1', 'none');
        form.append('Format___lazyCoP---0.1', 'tptp:raw');
        form.append('Command___lazyCoP---0.1', 'run_lazyCoP %s');
        form.append('TimeLimit___leanCoP---2.2', '60');
        form.append('Transform___leanCoP---2.2', 'none');
        form.append('Format___leanCoP---2.2', 'tptp:raw');
        form.append('Command___leanCoP---2.2', 'leancop.sh %s %d');
        form.append('TimeLimit___LEO-II---1.7.0', '60');
        form.append('Transform___LEO-II---1.7.0', 'none');
        form.append('Format___LEO-II---1.7.0', 'tptp');
        form.append('Command___LEO-II---1.7.0', 'leo --timeout %d --proofoutput 1 --foatp e --atp e=/home/tptp/Systems/LEO-II---1.7.0/eprover %s');
        form.append('TimeLimit___Leo-III---1.7.18', '60');
        form.append('Transform___Leo-III---1.7.18', 'none');
        form.append('Format___Leo-III---1.7.18', 'tptp:raw');
        form.append('Command___Leo-III---1.7.18', 'run_Leo-III %s %d THM');
        form.append('TimeLimit___Leo-III-SAT---1.7.18', '60');
        form.append('Transform___Leo-III-SAT---1.7.18', 'none');
        form.append('Format___Leo-III-SAT---1.7.18', 'tptp:raw');
        form.append('Command___Leo-III-SAT---1.7.18', 'run_Leo-III %s %d SAT');
        form.append('TimeLimit___Mace4---1109a', '60');
        form.append('Transform___Mace4---1109a', 'none');
        form.append('Format___Mace4---1109a', 'tptp:raw');
        form.append('Command___Mace4---1109a', 'tptp2X_and_run_mace4 %d %s');
        form.append('TimeLimit___MaedMax---1.4', '60');
        form.append('Transform___MaedMax---1.4', 'none');
        form.append('Format___MaedMax---1.4', 'tptp');
        form.append('Command___MaedMax---1.4', 'run_maedmax %d %s');
        form.append('TimeLimit___Matita---1.0', '60');
        form.append('Transform___Matita---1.0', 'none');
        form.append('Format___Matita---1.0', 'tptp:raw');
        form.append('Command___Matita---1.0', 'matitaprover --timeout %d --tptppath /home/tptp/TPTP %s');
        form.append('TimeLimit___Metis---2.4', '60');
        form.append('Transform___Metis---2.4', 'none');
        form.append('Format___Metis---2.4', 'tptp:raw');
        form.append('Command___Metis---2.4', 'metis --show proof --show saturation %s');
        form.append('TimeLimit___Moca---0.1', '60');
        form.append('Transform___Moca---0.1', 'none');
        form.append('Format___Moca---0.1', 'tptp:raw');
        form.append('Command___Moca---0.1', 'moca.sh %s');
        form.append('TimeLimit___Muscadet---4.5', '60');
        form.append('Transform___Muscadet---4.5', 'none');
        form.append('Format___Muscadet---4.5', 'tptp:raw');
        form.append('Command___Muscadet---4.5', 'muscadet %s');
        form.append('TimeLimit___nanoCoP---2.0', '60');
        form.append('Transform___nanoCoP---2.0', 'none');
        form.append('Format___nanoCoP---2.0', 'tptp:raw');
        form.append('Command___nanoCoP---2.0', 'nanocop.sh %s %d');
        form.append('TimeLimit___Otter---3.3', '60');
        form.append('Transform___Otter---3.3', 'none');
        form.append('Format___Otter---3.3', 'tptp:raw');
        form.append('Command___Otter---3.3', 'otter-tptp-script %s');
        form.append('TimeLimit___Paradox---4.0', '60');
        form.append('Transform___Paradox---4.0', 'none');
        form.append('Format___Paradox---4.0', 'tptp:short');
        form.append('Command___Paradox---4.0', 'paradox --no-progress --time %d --tstp --model %s');
        form.append('TimeLimit___Princess---230619', '60');
        form.append('Transform___Princess---230619', 'none');
        form.append('Format___Princess---230619', 'tptp');
        form.append('Command___Princess---230619', 'princess -inputFormat=tptp +threads -portfolio=casc +printProof -timeoutSec=%d %s');
        form.append('TimeLimit___Prover9---1109a', '60');
        form.append('Transform___Prover9---1109a', 'none');
        form.append('Format___Prover9---1109a', 'tptp:raw');
        form.append('Command___Prover9---1109a', 'tptp2X_and_run_prover9 %d %s');
        form.append('TimeLimit___PyRes---1.5', '60');
        form.append('Transform___PyRes---1.5', 'none');
        form.append('Format___PyRes---1.5', 'tptp:raw');
        form.append('Command___PyRes---1.5', 'pyres-fof.py -tifbsVp -nlargest -HPickGiven5 %s');
        form.append('TimeLimit___RPx---1.0', '60');
        form.append('Transform___RPx---1.0', 'none');
        form.append('Format___RPx---1.0', 'tptp:raw');
        form.append('Command___RPx---1.0', 'run_RPx %s');
        form.append('TimeLimit___Satallax---3.5', '60');
        form.append('Transform___Satallax---3.5', 'none');
        form.append('Format___Satallax---3.5', 'tptp:raw');
        form.append('Command___Satallax---3.5', 'run_satallax %d %s');
        form.append('TimeLimit___SATCoP---0.1', '60');
        form.append('Transform___SATCoP---0.1', 'none');
        form.append('Format___SATCoP---0.1', 'tptp:raw');
        form.append('Command___SATCoP---0.1', 'satcop --statistics %s');
        form.append('TimeLimit___Scavenger---EP-0.2', '60');
        form.append('Transform___Scavenger---EP-0.2', 'none');
        form.append('Format___Scavenger---EP-0.2', 'tptp:raw');
        form.append('Command___Scavenger---EP-0.2', 'run_scavenger %s');
        form.append('TimeLimit___SnakeForV---1.0', '60');
        form.append('Transform___SnakeForV---1.0', 'none');
        form.append('Format___SnakeForV---1.0', 'tptp:raw');
        form.append('Command___SnakeForV---1.0', 'vampire --input_syntax tptp --proof tptp --output_axiom_names on --mode portfolio --schedule snake_tptp_uns --cores 0 -t %d %s');
        form.append('TimeLimit___SnakeForV-SAT---1.0', '60');
        form.append('Transform___SnakeForV-SAT---1.0', 'none');
        form.append('Format___SnakeForV-SAT---1.0', 'tptp:raw');
        form.append('Command___SnakeForV-SAT---1.0', 'vampire --input_syntax tptp --proof tptp --output_axiom_names on --mode portfolio --schedule snake_tptp_sat --cores 0 -t %d %s');
        form.append('TimeLimit___SNARK---20120808r022', '60');
        form.append('Transform___SNARK---20120808r022', 'none');
        form.append('Format___SNARK---20120808r022', 'tptp:raw');
        form.append('Command___SNARK---20120808r022', 'run-snark %s %d');
        form.append('TimeLimit___SPASS+T---2.2.22', '60');
        form.append('Transform___SPASS+T---2.2.22', 'none');
        form.append('Format___SPASS+T---2.2.22', 'tptp:raw');
        form.append('Command___SPASS+T---2.2.22', 'spasst-tptp-script %s %d');
        form.append('TimeLimit___SPASS---3.9', '60');
        form.append('Transform___SPASS---3.9', 'none');
        form.append('Format___SPASS---3.9', 'tptp');
        form.append('Command___SPASS---3.9', 'run_spass %d %s');
        form.append('TimeLimit___SRASS---0.1', '60');
        form.append('Transform___SRASS---0.1', 'none');
        form.append('Format___SRASS---0.1', 'tptp:raw');
        form.append('Command___SRASS---0.1', 'SRASS -q2 -a 0 10 10 10 -i3 -n60 %s');
        form.append('TimeLimit___ToFoF---0.1', '60');
        form.append('Transform___ToFoF---0.1', 'none');
        form.append('Format___ToFoF---0.1', 'tptp:raw');
        form.append('Command___ToFoF---0.1', 'tofof %d %s');
        form.append('TimeLimit___ToFoF-SAT---0.1', '60');
        form.append('Transform___ToFoF-SAT---0.1', 'none');
        form.append('Format___ToFoF-SAT---0.1', 'tptp:raw');
        form.append('Command___ToFoF-SAT---0.1', 'tofof %d %s --model');
        form.append('TimeLimit___Toma---0.4', '60');
        form.append('Transform___Toma---0.4', 'none');
        form.append('Format___Toma---0.4', 'tptp:raw');
        form.append('Command___Toma---0.4', 'run_toma %s');
        form.append('TimeLimit___Twee---2.5.0', '60');
        form.append('Transform___Twee---2.5.0', 'none');
        form.append('Format___Twee---2.5.0', 'tptp:raw');
        form.append('Command___Twee---2.5.0', 'parallel-twee %s --tstp --conditional-encoding if --smaller --drop-non-horn --give-up-on-saturation --explain-encoding --formal-proof');
        form.append('TimeLimit___Vampire---4.9', '60');
        form.append('Transform___Vampire---4.9', 'none');
        form.append('Format___Vampire---4.9', 'tptp:raw');
        form.append('Command___Vampire---4.9', 'run_vampire %s %d THM');
        form.append('TimeLimit___Vampire-FMo---4.9', '60');
        form.append('Transform___Vampire-FMo---4.9', 'none');
        form.append('Format___Vampire-FMo---4.9', 'tptp:raw');
        form.append('Command___Vampire-FMo---4.9', 'vampire %s -t %d -sa fmb -qa off');
        form.append('TimeLimit___Vampire-SAT---4.9', '60');
        form.append('Transform___Vampire-SAT---4.9', 'none');
        form.append('Format___Vampire-SAT---4.9', 'tptp:raw');
        form.append('Command___Vampire-SAT---4.9', 'run_vampire %s %d SAT');
        form.append('TimeLimit___VampireLite---4.9', '60');
        form.append('Transform___VampireLite---4.9', 'none');
        form.append('Format___VampireLite---4.9', 'tptp:raw');
        form.append('Command___VampireLite---4.9', 'run_vampire %s %d LITE');
        form.append('TimeLimit___Waldmeister---710', '60');
        form.append('Transform___Waldmeister---710', 'none');
        form.append('Format___Waldmeister---710', 'tptp:raw');
        form.append('Command___Waldmeister---710', 'woody %s');
        form.append('TimeLimit___Z3---4.15.1', '60');
        form.append('Transform___Z3---4.15.1', 'none');
        form.append('Format___Z3---4.15.1', 'tptp');
        form.append('Command___Z3---4.15.1', 'run_z3 -proof -model -t:%d -file:%s');
        form.append('TimeLimit___Zenon---0.7.1', '60');
        form.append('Transform___Zenon---0.7.1', 'none');
        form.append('Format___Zenon---0.7.1', 'tptp:raw');
        form.append('Command___Zenon---0.7.1', 'run_zenon %s %d');
        form.append('TimeLimit___ZenonModulo---0.5.0', '60');
        form.append('Transform___ZenonModulo---0.5.0', 'none');
        form.append('Format___ZenonModulo---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModulo---0.5.0', 'run_zenon_modulo %d %s NONE');
        form.append('TimeLimit___ZenonModuloDK---0.5.0', '60');
        form.append('Transform___ZenonModuloDK---0.5.0', 'none');
        form.append('Format___ZenonModuloDK---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModuloDK---0.5.0', 'run_zenon_modulo %d %s DK');
        form.append('TimeLimit___ZenonModuloLP---0.5.0', '60');
        form.append('Transform___ZenonModuloLP---0.5.0', 'none');
        form.append('Format___ZenonModuloLP---0.5.0', 'tptp:raw');
        form.append('Command___ZenonModuloLP---0.5.0', 'run_zenon_modulo %d %s LP');
        form.append('TimeLimit___Zipperpin---2.1', '60');
        form.append('Transform___Zipperpin---2.1', 'none');
        form.append('Format___Zipperpin---2.1', 'tptp:raw');
        form.append('Command___Zipperpin---2.1', 'run_zipperposition %s %d');

        try {
          fetch("https://tptp.org/cgi-bin/SystemOnTPTPFormReply", {
            method: 'POST',
            body: form,
          })
          .then(response => response.text())
          .then(html => {
            const resultHtml = html;

            const resultPanel = vscode.window.createWebviewPanel(
              'tptpResult',
              'TPTP Result',
              vscode.ViewColumn.Two,
              { enableScripts: true }
            );

            resultPanel.webview.html = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>TPTP Prover Result</title>
                <style>
                  .collapsable button { background-color: var(--vscode-activityBar-border) } 
                  h1 { text-decoration: underline; }
                  h2 { color: var(--vscode-editorLightBulb-foreground); }
                  pre { line-height: 20px; }
                  body { margin: 20px !important; }
                  span { background-color: var(--vscode-toolbar-hoverBackground); padding: 5px; border-radius: 10px; }
                  button {
                    align-items: center;
                    appearance: button;
                    background-color: var(--vscode-focusBorder);
                    border-radius: 8px;
                    border-style: none;
                    box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    flex-shrink: 0;
                    font-family: "Segoe UI", sans-serif;
                    font-size: 100%;
                    line-height: 1.15;
                    margin: 0;
                    padding: 10px 13px;
                    text-align: center;
                    text-transform: none;
                    transition:
                      color 0.13s ease-in-out,
                      background 0.13s ease-in-out,
                      opacity 0.13s ease-in-out,
                      box-shadow 0.13s ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                  }
                </style>
              </head>
              <body>
                <h1>TPTP Prover Result</h1>
                <h2>Prover: <span>${userData.prover}</span></h2>
                
                ${resultHtml.replace('Loading IDV ... ', '')}
                
              </body>
              </html>
            `;
          })
          .catch(error => {
              console.error('Fetch error:', error);
          });

        } catch (error: any) {
          vscode.window.showErrorMessage(`Error submitting to TPTP: ${error.message}`);
        }
      }
    });

  })

  context.subscriptions.push(proveProblemMultiple);

  //@                                                                                  

  //@ PROCESS SOLUTION                                                                 
  const processSolution = vscode.commands.registerCommand('tptp.processSolution', async (uri: vscode.Uri) => {
    const doc = await vscode.workspace.openTextDocument(uri);
    const content = doc.getText();

    const panel = vscode.window.createWebviewPanel(
      'customMenu',
      'TPTP Process Solution Options',
      vscode.ViewColumn.Two,
      { enableScripts: true }  // allow JS
    );

    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>TPTP Process Solution Options</title>

      <style>
                  .collapsable button { background-color: var(--vscode-activityBar-border) } 
        body {
          font-family: "Inter", sans-serif;
        }

        h1 { 
          text-decoration: underline; 
        }

        label {
          display: flex;
          cursor: pointer;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.375em;
        }

        label input {
          position: absolute;
          left: -9999px;
        }

        label input:checked + span {
          background-color: var(--vscode-button-background);
        }

        label input:checked + span:before {
          box-shadow: inset 0 0 0 0.4375em #00005c;
        }

        label span {
          display: flex;
          align-items: center;
          padding: 0.375em 0.75em 0.375em 0.375em;
          border-radius: 99em;
          transition: 0.25s ease;
        }

        label span:hover {
          background-color: var(--vscode-button-hoverBackground);
        }

        label span:before {
          display: flex;
          flex-shrink: 0;
          content: "";
          background-color: #fff;
          width: 1.5em;
          height: 1.5em;
          border-radius: 50%;
          margin-right: 0.375em;
          transition: 0.25s ease;
          box-shadow: inset 0 0 0 0.125em #00005c;
        }

        .submit-btn {
          align-items: center;
          appearance: button;
          background-color: var(--vscode-focusBorder);
          border-radius: 8px;
          border-style: none;
          box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          flex-shrink: 0;
          font-family: "Segoe UI", sans-serif;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
          padding: 10px 21px;
          text-align: center;
          text-transform: none;
          transition:
            color 0.13s ease-in-out,
            background 0.13s ease-in-out,
            opacity 0.13s ease-in-out,
            box-shadow 0.13s ease-in-out;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .filename-txt {
          color: var(--vscode-editorLightBulb-foreground);
        }

        form { line-height: 20px; }
      </style>
    </head>
    <body>
      <h1>TPTP Process Solution Options</h1>
      <p class="filename-txt">File: ${path.basename(doc.uri.fsPath)}</p>

      <form id="optionsForm">
        <label> <input type="radio" name="prover" value="BNFParser---0.0"> <span>BNFParser 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="BNFParserTree---0.0"> <span>BNFParserTree 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="BNFParserDrill---0.0"> <span>BNFParserDrill 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="TPTP4X---0.0"> <span>TPTP4X 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="TPTP2JSON---0.1"> <span>TPTP2JSON 0.1</span> <br> </label>
        <label> <input type="radio" name="prover" value="AGInTRater---0.0"> <span>AGInTRater 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="AGMV---1.0"> <span>AGMV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GAPT---2.16.0"> <span>GAPT 2.16.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GDV---1.0"> <span>GDV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GDV-LP---1.0"> <span>GDV-LP 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="IDV---1.0"> <span>IDV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="IIV---0.0"> <span>IIV 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ITV---0.0"> <span>ITV 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="OAESys---0.0"> <span>OAESys 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="OAFSys---0.0"> <span>OAFSys 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ProofStats---1.0"> <span>ProofStats 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="PProofSummary---0.0"> <span>PProofSummary 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ProofSummary---0.0"> <span>ProofSummary 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="SolutionStats---1.0"> <span>SolutionStats 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="InterpretByATP---0.0"> <span>InterpretByATP 0.0</span> <br> </label>
        
        <button class="submit-btn" type="submit">Prove</button>
      </form>
      <br><br><br><br>

      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('optionsForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const proverInput = document.querySelector('input[type="radio"]:checked');
          const prover = proverInput ? proverInput.value : null;

          vscode.postMessage({
            type: 'submit',
            payload: { prover: prover }
          });
        });
      </script>

    </body>
    </html>
    `;

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === 'submit') {
        const userData = message.payload;
        // vscode.window.showInformationMessage(`You selected: ${userData.prover}`);
        panel.dispose();

        const form = new FormData();
        form.append('TPTPProblem', '');
        form.append('SystemAndVersion', '');
        form.append('ProblemSource', 'FORMULAE');
        form.append('FORMULAEProblem', content);
        form.append('UPLOADProblem', '');
        form.append('FormulaURL', '');
        form.append('SolutionFormat', 'TPTP');
        form.append('QuietFlag', '-q01');
        form.append('SubmitButton', 'ProcessSolution');
        form.append('TimeLimit___AGInTRater---0.0', '60');
        form.append('Transform___AGInTRater---0.0', 'none');
        form.append('Format___AGInTRater---0.0', 'tptp:raw');
        form.append('Command___AGInTRater---0.0', 'AGInTRater -c %s');
        form.append('TimeLimit___AGMV---1.0', '60');
        form.append('Transform___AGMV---1.0', 'none');
        form.append('Format___AGMV---1.0', 'tptp:raw');
        form.append('Command___AGMV---1.0', 'run_AGMV %d %s');
        form.append('TimeLimit___BNFParser---0.0', '60');
        form.append('Transform___BNFParser---0.0', 'none');
        form.append('Format___BNFParser---0.0', 'tptp:raw');
        form.append('Command___BNFParser---0.0', 'BNFParser %s');
        form.append('TimeLimit___BNFParserTree---0.0', '60');
        form.append('Transform___BNFParserTree---0.0', 'none');
        form.append('Format___BNFParserTree---0.0', 'tptp:raw');
        form.append('Command___BNFParserTree---0.0', 'BNFParserTree %s');
        form.append('TimeLimit___GAPT---2.16.0', '300');
        form.append('Transform___GAPT---2.16.0', 'none');
        form.append('Format___GAPT---2.16.0', 'tptp:raw');
        form.append('Command___GAPT---2.16.0', 'load_tstp.sh -t %d %s');
        form.append('TimeLimit___GDV---1.0', '300');
        form.append('Transform___GDV---1.0', 'none');
        form.append('Format___GDV---1.0', 'tptp:raw');
        form.append('Command___GDV---1.0', 'run_GDV %s 30');
        form.append('TimeLimit___GDV-LP---1.0', '300');
        form.append('Transform___GDV-LP---1.0', 'none');
        form.append('Format___GDV-LP---1.0', 'tptp:raw');
        form.append('Command___GDV-LP---1.0', 'run_GDV %s 30 LP');
        form.append(`System___${userData.prover}`, userData.prover);
        form.append('TimeLimit___IDV---1.0', '60');
        form.append('Transform___IDV---1.0', 'none');
        form.append('Format___IDV---1.0', 'tptp');
        form.append('Command___IDV---1.0', 'run_IDV %s');
        form.append('TimeLimit___IIV---0.0', '60');
        form.append('Transform___IIV---0.0', 'none');
        form.append('Format___IIV---0.0', 'tptp:raw');
        form.append('Command___IIV---0.0', 'run_IIV %s');
        form.append('TimeLimit___InterpretByATP---0.0', '60');
        form.append('Transform___InterpretByATP---0.0', 'none');
        form.append('Format___InterpretByATP---0.0', 'tptp:raw');
        form.append('Command___InterpretByATP---0.0', 'run_InterpretByATP %d %s');
        form.append('TimeLimit___ITV---0.0', '60');
        form.append('Transform___ITV---0.0', 'none');
        form.append('Format___ITV---0.0', 'tptp:raw');
        form.append('Command___ITV---0.0', 'run_ITV %s');
        form.append('TimeLimit___PProofSummary---0.0', '60');
        form.append('Transform___PProofSummary---0.0', 'none');
        form.append('Format___PProofSummary---0.0', 'tptp:raw');
        form.append('Command___PProofSummary---0.0', 'ProofSummary -f prolog %s');
        form.append('TimeLimit___ProofStats---1.0', '60');
        form.append('Transform___ProofStats---1.0', 'none');
        form.append('Format___ProofStats---1.0', 'tptp:raw');
        form.append('Command___ProofStats---1.0', 'run_MakeTreeStats %s');
        form.append('TimeLimit___ProofSummary---0.0', '60');
        form.append('Transform___ProofSummary---0.0', 'none');
        form.append('Format___ProofSummary---0.0', 'tptp:raw');
        form.append('Command___ProofSummary---0.0', 'ProofSummary -f tptp %s');
        form.append('TimeLimit___SolutionStats---1.0', '60');
        form.append('Transform___SolutionStats---1.0', 'none');
        form.append('Format___SolutionStats---1.0', 'tptp:raw');
        form.append('Command___SolutionStats---1.0', 'run_MakeTreeStats %s');
        form.append('TimeLimit___TPTP2JSON---0.1', '60');
        form.append('Transform___TPTP2JSON---0.1', 'none');
        form.append('Format___TPTP2JSON---0.1', 'tptp:raw');
        form.append('Command___TPTP2JSON---0.1', 'run_tptp2json %s');
        form.append('TimeLimit___TPTP4X---0.0', '60');
        form.append('Transform___TPTP4X---0.0', 'none');
        form.append('Format___TPTP4X---0.0', 'tptp:raw');
        form.append('Command___TPTP4X---0.0', 'tptp4X %s');

        try {
          fetch("https://tptp.org/cgi-bin/SystemOnTPTPFormReply", {
            method: 'POST',
            body: form,
          })
          .then(response => response.text())
          .then(html => {
            const resultHtml = html;

            const resultPanel = vscode.window.createWebviewPanel(
              'tptpResult',
              'TPTP Processed Solution',
              vscode.ViewColumn.Two,
              { enableScripts: true }
            );

            resultPanel.webview.html = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>TPTP Processed Solution</title>
                <style>
                  .collapsable button { background-color: var(--vscode-activityBar-border) } 
                  h1 { text-decoration: underline; }
                  h2 { color: var(--vscode-editorLightBulb-foreground); }
                  pre { line-height: 20px; }
                  body { margin: 20px !important; }
                  span { background-color: var(--vscode-toolbar-hoverBackground); padding: 5px; border-radius: 10px; }
                  button {
                    align-items: center;
                    appearance: button;
                    background-color: var(--vscode-focusBorder);
                    border-radius: 8px;
                    border-style: none;
                    box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    flex-shrink: 0;
                    font-family: "Segoe UI", sans-serif;
                    font-size: 100%;
                    line-height: 1.15;
                    margin: 0;
                    padding: 10px 13px;
                    text-align: center;
                    text-transform: none;
                    transition:
                      color 0.13s ease-in-out,
                      background 0.13s ease-in-out,
                      opacity 0.13s ease-in-out,
                      box-shadow 0.13s ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                  }
                </style>
              </head>
              <body>
                <h1>TPTP Processed Solution</h1>
                <h2>System: <span>${userData.prover}</span></h2>

                ${resultHtml.replace('Loading IDV ... ', '')}

                <script>
                  const vscode = acquireVsCodeApi();
                  function downloadResult() {
                    const content = document.querySelector('pre').innerText;
                    vscode.postMessage({command: 'download', content: content});
                  }
                </script>
              </body>
              </html>
            `;
          })
          .catch(error => {
              console.error('Fetch error:', error);
          });

        } catch (error: any) {
          vscode.window.showErrorMessage(`Error submitting to TPTP: ${error.message}`);
        }
      }
    })
  })

  context.subscriptions.push(processSolution);

  //@                                                                                  


  //@ PROCESS SOLUTION (USING MULTIPLE PROCESSORS)                                     
  const processSolutionMultiple = vscode.commands.registerCommand('tptp.processSolutionMultiple', async (uri: vscode.Uri) => {
    const doc = await vscode.workspace.openTextDocument(uri);
    const content = doc.getText();

    const panel = vscode.window.createWebviewPanel(
      'customMenu',
      'TPTP Process Solutions Options',
      vscode.ViewColumn.Two,
      { enableScripts: true }  // allow JS
    );

    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>TPTP Process Solutions Options</title>

      <style>
        .collapsable button { background-color: var(--vscode-activityBar-border) } 
        body {
          font-family: "Inter", sans-serif;
        }

        h1 { 
          text-decoration: underline; 
        }

        label {
          display: flex;
          cursor: pointer;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.375em;
        }

        label input {
          position: absolute;
          left: -9999px;
        }

        label input:checked + span {
          background-color: var(--vscode-button-background);
        }

        label input:checked + span:before {
          box-shadow: inset 0 0 0 0.4375em #00005c;
        }

        label span {
          display: flex;
          align-items: center;
          padding: 0.375em 0.75em 0.375em 0.375em;
          border-radius: 99em;
          transition: 0.25s ease;
        }

        label span:hover {
          background-color: var(--vscode-button-hoverBackground);
        }

        label span:before {
          display: flex;
          flex-shrink: 0;
          content: "";
          background-color: #fff;
          width: 1.5em;
          height: 1.5em;
          border-radius: 50%;
          margin-right: 0.375em;
          transition: 0.25s ease;
          box-shadow: inset 0 0 0 0.125em #00005c;
        }

        .submit-btn {
          align-items: center;
          appearance: button;
          background-color: var(--vscode-focusBorder);
          border-radius: 8px;
          border-style: none;
          box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          flex-shrink: 0;
          font-family: "Segoe UI", sans-serif;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
          padding: 10px 21px;
          text-align: center;
          text-transform: none;
          transition:
            color 0.13s ease-in-out,
            background 0.13s ease-in-out,
            opacity 0.13s ease-in-out,
            box-shadow 0.13s ease-in-out;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }

        .filename-txt {
          color: var(--vscode-editorLightBulb-foreground);
        }

        form { line-height: 20px; }
      </style>
    </head>
    <body>
      <h1>TPTP Process Solution Options</h1>
      <p class="filename-txt">File: ${path.basename(doc.uri.fsPath)}</p>

      <form id="optionsForm">
        <label> <input type="radio" name="prover" value="BNFParser---0.0"> <span>BNFParser 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="BNFParserTree---0.0"> <span>BNFParserTree 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="BNFParserDrill---0.0"> <span>BNFParserDrill 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="TPTP4X---0.0"> <span>TPTP4X 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="TPTP2JSON---0.1"> <span>TPTP2JSON 0.1</span> <br> </label>
        <label> <input type="radio" name="prover" value="AGInTRater---0.0"> <span>AGInTRater 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="AGMV---1.0"> <span>AGMV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GAPT---2.16.0"> <span>GAPT 2.16.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GDV---1.0"> <span>GDV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="GDV-LP---1.0"> <span>GDV-LP 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="IDV---1.0"> <span>IDV 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="IIV---0.0"> <span>IIV 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ITV---0.0"> <span>ITV 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="OAESys---0.0"> <span>OAESys 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="OAFSys---0.0"> <span>OAFSys 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ProofStats---1.0"> <span>ProofStats 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="PProofSummary---0.0"> <span>PProofSummary 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="ProofSummary---0.0"> <span>ProofSummary 0.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="SolutionStats---1.0"> <span>SolutionStats 1.0</span> <br> </label>
        <label> <input type="radio" name="prover" value="InterpretByATP---0.0"> <span>InterpretByATP 0.0</span> <br> </label>
        
        <button class="submit-btn" type="submit">Prove</button>
      </form>
      <br><br><br><br>

      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('optionsForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const proversInput = document.querySelectorAll('input[type="checkbox"]:checked');
          const provers = proversInput ? Array.from(proversInput).map(inp => { return inp.value }) : null;

          vscode.postMessage({
            type: 'submit',
            payload: { provers: provers }
          });
        });
      </script>

    </body>
    </html>
    `;

    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.type === 'submit') {
        const userData = message.payload;
        // vscode.window.showInformationMessage(`You selected: ${userData.prover}`);
        panel.dispose();

        const form = new FormData();
        form.append('TPTPProblem', '');
        form.append('SystemAndVersion', '');
        form.append('ProblemSource', 'FORMULAE');
        form.append('FORMULAEProblem', content);
        form.append('UPLOADProblem', '');
        form.append('FormulaURL', '');
        form.append('SolutionFormat', 'TPTP');
        form.append('QuietFlag', '-q01');
        form.append('SubmitButton', 'ProcessSolution');
        form.append('TimeLimit___AGInTRater---0.0', '60');
        form.append('Transform___AGInTRater---0.0', 'none');
        form.append('Format___AGInTRater---0.0', 'tptp:raw');
        form.append('Command___AGInTRater---0.0', 'AGInTRater -c %s');
        form.append('TimeLimit___AGMV---1.0', '60');
        form.append('Transform___AGMV---1.0', 'none');
        form.append('Format___AGMV---1.0', 'tptp:raw');
        form.append('Command___AGMV---1.0', 'run_AGMV %d %s');
        form.append('TimeLimit___BNFParser---0.0', '60');
        form.append('Transform___BNFParser---0.0', 'none');
        form.append('Format___BNFParser---0.0', 'tptp:raw');
        form.append('Command___BNFParser---0.0', 'BNFParser %s');
        form.append('TimeLimit___BNFParserTree---0.0', '60');
        form.append('Transform___BNFParserTree---0.0', 'none');
        form.append('Format___BNFParserTree---0.0', 'tptp:raw');
        form.append('Command___BNFParserTree---0.0', 'BNFParserTree %s');
        form.append('TimeLimit___GAPT---2.16.0', '300');
        form.append('Transform___GAPT---2.16.0', 'none');
        form.append('Format___GAPT---2.16.0', 'tptp:raw');
        form.append('Command___GAPT---2.16.0', 'load_tstp.sh -t %d %s');
        form.append('TimeLimit___GDV---1.0', '300');
        form.append('Transform___GDV---1.0', 'none');
        form.append('Format___GDV---1.0', 'tptp:raw');
        form.append('Command___GDV---1.0', 'run_GDV %s 30');
        form.append('TimeLimit___GDV-LP---1.0', '300');
        form.append('Transform___GDV-LP---1.0', 'none');
        form.append('Format___GDV-LP---1.0', 'tptp:raw');
        form.append('Command___GDV-LP---1.0', 'run_GDV %s 30 LP');

        for (const prover of userData.provers) {
          form.append(`System___${prover}`, prover);
        }

        form.append('TimeLimit___IDV---1.0', '60');
        form.append('Transform___IDV---1.0', 'none');
        form.append('Format___IDV---1.0', 'tptp');
        form.append('Command___IDV---1.0', 'run_IDV %s');
        form.append('TimeLimit___IIV---0.0', '60');
        form.append('Transform___IIV---0.0', 'none');
        form.append('Format___IIV---0.0', 'tptp:raw');
        form.append('Command___IIV---0.0', 'run_IIV %s');
        form.append('TimeLimit___InterpretByATP---0.0', '60');
        form.append('Transform___InterpretByATP---0.0', 'none');
        form.append('Format___InterpretByATP---0.0', 'tptp:raw');
        form.append('Command___InterpretByATP---0.0', 'run_InterpretByATP %d %s');
        form.append('TimeLimit___ITV---0.0', '60');
        form.append('Transform___ITV---0.0', 'none');
        form.append('Format___ITV---0.0', 'tptp:raw');
        form.append('Command___ITV---0.0', 'run_ITV %s');
        form.append('TimeLimit___PProofSummary---0.0', '60');
        form.append('Transform___PProofSummary---0.0', 'none');
        form.append('Format___PProofSummary---0.0', 'tptp:raw');
        form.append('Command___PProofSummary---0.0', 'ProofSummary -f prolog %s');
        form.append('TimeLimit___ProofStats---1.0', '60');
        form.append('Transform___ProofStats---1.0', 'none');
        form.append('Format___ProofStats---1.0', 'tptp:raw');
        form.append('Command___ProofStats---1.0', 'run_MakeTreeStats %s');
        form.append('TimeLimit___ProofSummary---0.0', '60');
        form.append('Transform___ProofSummary---0.0', 'none');
        form.append('Format___ProofSummary---0.0', 'tptp:raw');
        form.append('Command___ProofSummary---0.0', 'ProofSummary -f tptp %s');
        form.append('TimeLimit___SolutionStats---1.0', '60');
        form.append('Transform___SolutionStats---1.0', 'none');
        form.append('Format___SolutionStats---1.0', 'tptp:raw');
        form.append('Command___SolutionStats---1.0', 'run_MakeTreeStats %s');
        form.append('TimeLimit___TPTP2JSON---0.1', '60');
        form.append('Transform___TPTP2JSON---0.1', 'none');
        form.append('Format___TPTP2JSON---0.1', 'tptp:raw');
        form.append('Command___TPTP2JSON---0.1', 'run_tptp2json %s');
        form.append('TimeLimit___TPTP4X---0.0', '60');
        form.append('Transform___TPTP4X---0.0', 'none');
        form.append('Format___TPTP4X---0.0', 'tptp:raw');
        form.append('Command___TPTP4X---0.0', 'tptp4X %s');

        try {
          fetch("https://tptp.org/cgi-bin/SystemOnTPTPFormReply", {
            method: 'POST',
            body: form,
          })
          .then(response => response.text())
          .then(html => {
            const resultHtml = html;

            const resultPanel = vscode.window.createWebviewPanel(
              'tptpResult',
              'TPTP Processed Solution',
              vscode.ViewColumn.Two,
              { enableScripts: true }
            );

            resultPanel.webview.html = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <title>TPTP Processed Solution</title>
                <style>
                  .collapsable button { background-color: var(--vscode-activityBar-border) } 
                  h1 { text-decoration: underline; }
                  h2 { color: var(--vscode-editorLightBulb-foreground); }
                  pre { line-height: 20px; }
                  body { margin: 20px !important; }
                  span { background-color: var(--vscode-toolbar-hoverBackground); padding: 5px; border-radius: 10px; }
                  button {
                    align-items: center;
                    appearance: button;
                    background-color: var(--vscode-focusBorder);
                    border-radius: 8px;
                    border-style: none;
                    box-shadow: var(--vscode-chart-line) 0 1px 2px inset;
                    box-sizing: border-box;
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    flex-direction: row;
                    flex-shrink: 0;
                    font-family: "Segoe UI", sans-serif;
                    font-size: 100%;
                    line-height: 1.15;
                    margin: 0;
                    padding: 10px 13px;
                    text-align: center;
                    text-transform: none;
                    transition:
                      color 0.13s ease-in-out,
                      background 0.13s ease-in-out,
                      opacity 0.13s ease-in-out,
                      box-shadow 0.13s ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                  }
                </style>
              </head>
              <body>
                <h1>TPTP Processed Solution</h1>
                <h2>System: <span>${userData.provers.join(", ")}</span></h2>

                ${resultHtml.replace('Loading IDV ... ', '')}

                <script>
                  const vscode = acquireVsCodeApi();
                  function downloadResult() {
                    const content = document.querySelector('pre').innerText;
                    vscode.postMessage({command: 'download', content: content});
                  }
                </script>
              </body>
              </html>
            `;
          })
          .catch(error => {
              console.error('Fetch error:', error);
          });

        } catch (error: any) {
          vscode.window.showErrorMessage(`Error submitting to TPTP: ${error.message}`);
        }
      }
    })
  })

  context.subscriptions.push(processSolutionMultiple);

  //@                                                                                  

  //@ IMPORT PROBLEM                                                                   
  const importProblem = vscode.commands.registerCommand('tptp.importProblem', async () => {
    const category = await vscode.window.showQuickPick(['AGT', 'ALG', 'ANA', 'ARI', 'BIO', 'BOO', 'CAT', 'COL', 'COM', 'CSR', 'DAT', 'FLD', 'GEG', 'GEO', 'GRA', 'GRP', 'HAL', 'HEN', 'HWC', 'HWV', 'ITP', 'KLE', 'KRS', 'LAT', 'LCL', 'LDA', 'LIN', 'MED', 'MGT', 'MSC', 'MVA', 'NLP', 'NUM', 'NUN', 'PHI', 'PLA', 'PRD', 'PRO', 'PUZ', 'QUA', 'RAL', 'REL', 'RNG', 'ROB', 'SCT', 'SET', 'SEU', 'SEV', 'SWB', 'SWC', 'SWV', 'SWW', 'SYN', 'SYO', 'TOP'], {placeHolder : "Select a category for the problem"});

    const response = await fetch(`https://tptp.org/cgi-bin/SeeTPTP?Category=Problems&Domain=${category}`)
    const html = await response.text();

    const matches = [...html.matchAll(/<tt>(.*?)<\/tt>/g)];
    const options = matches.map(match => match[1].trim());

    const selectedProblem = await vscode.window.showQuickPick(options, {placeHolder: "Select a problem to import"});

    if (selectedProblem) {
      const problemUrl = `https://tptp.org/cgi-bin/SeeTPTP?Category=Problems&Domain=${category}&File=${encodeURIComponent(selectedProblem)}`;
      const problemResponse = await fetch(problemUrl);
      const problemHTML = await problemResponse.text();
      const match = problemHTML.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
      const problemText = match ? match[1].replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '') : '% No problem found';

      const doc = await vscode.workspace.openTextDocument({ language: 'tptp', content: problemText });
      await vscode.window.showTextDocument(doc);

      // save the problem to a file in the workspace?
      // const folder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      
      // if (!folder) {
      //   vscode.window.showErrorMessage('Please open a workspace folder before importing the problem.');
      //   return;
      // }

      // const fullPath = path.join(folder, `Problem_${selectedProblem}.p`);
      // const fileUri = vscode.Uri.file(fullPath);

      // await vscode.workspace.fs.writeFile(fileUri, Buffer.from(problemText, 'utf8'));
      // const doc = await vscode.workspace.openTextDocument(fileUri);
      // await vscode.window.showTextDocument(doc);

    } else {
      vscode.window.showInformationMessage('No problem selected.');
    }
  })

  context.subscriptions.push(importProblem);

  //@                                                                                  

  //@ IMPORT SOLUTION                                                                  
  const importSolution = vscode.commands.registerCommand('tptp.importSolution', async () => {
    const category = await vscode.window.showQuickPick(['AGT', 'ALG', 'ANA', 'ARI', 'BIO', 'BOO', 'CAT', 'COL', 'COM', 'CSR', 'DAT', 'FLD', 'GEG', 'GEO', 'GRA', 'GRP', 'HAL', 'HEN', 'HWC', 'HWV', 'ITP', 'KLE', 'KRS', 'LAT', 'LCL', 'LDA', 'LIN', 'MED', 'MGT', 'MSC', 'MVA', 'NLP', 'NUM', 'NUN', 'PHI', 'PLA', 'PRD', 'PRO', 'PUZ', 'QUA', 'RAL', 'REL', 'RNG', 'ROB', 'SCT', 'SET', 'SEU', 'SEV', 'SWB', 'SWC', 'SWV', 'SWW', 'SWX', 'SYN', 'SYO', 'TOP'], {placeHolder : "Select a category for the solution"});

    let response = await fetch(`https://tptp.org/cgi-bin/SeeTPTP?Category=Solutions&Domain=${category}`)
    let html = await response.text();

    let matches = [...html.matchAll(/<tt>(.*?)<\/tt>/g)];
    let options = matches.map(match => match[1].trim());

    const selectedSolution = await vscode.window.showQuickPick(options, {placeHolder: "Select a Solution to import"});

    response = await fetch(`https://tptp.org/cgi-bin/SeeTPTP?Category=Solutions&Domain=${category}&File=${selectedSolution}`)
    html = await response.text();

    console.log("HTML Content:", html);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    let anchors = Array.from(document.querySelectorAll("tbody > tr > td > a"))
      .map(a => a.getAttribute("href")?.split("System=")[1])
      .filter((s): s is string => typeof s === "string");
    console.log("Anchors:", anchors);

    const selectedSolutionProver = await vscode.window.showQuickPick(anchors, {placeHolder: "Select a Solution to import from specified prover"}) || '';

    if (selectedSolution) {
      const SolutionUrl = `https://tptp.org/cgi-bin/SeeTPTP?Category=Solutions&Domain=${category}&File=${selectedSolution}&System=${selectedSolutionProver}`;
      const SolutionResponse = await fetch(SolutionUrl);
      const SolutionHTML = await SolutionResponse.text();
      const match = SolutionHTML.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
      const SolutionText = match ? match[1].replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '') : '% No Solution found';

      const doc = await vscode.workspace.openTextDocument({ language: 'tptp', content: SolutionText });
      await vscode.window.showTextDocument(doc);

    } else {
      vscode.window.showInformationMessage('No Solution selected.');
    }

  })

  context.subscriptions.push(importSolution);

  //@                                                                                  


  //@ FORMAT DOCUMENT
  let disposable = vscode.commands.registerCommand(
    "tptp.formatDocument",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document.languageId === "tptp") {
        vscode.commands.executeCommand("editor.action.formatDocument");
      }
    }
  );

  context.subscriptions.push(disposable);

  //@                                                                                  

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
      // Notify the server about file changes to '.p' or '.s' files in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/*.{p,s}')
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