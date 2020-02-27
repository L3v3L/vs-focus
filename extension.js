// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function cut(min, max, current){
    let currentNew = [];
    current.forEach(item => {
        if(min.isAfterOrEqual(item[0]) && max.isBeforeOrEqual(item[1])){
            currentNew.push([item[0], min], [max, item[1]])
            return;
        }else{
            currentNew.push([item[0], item[1]])
            return;
        }
    });
    return currentNew;
}

let dt = vscode.window.createTextEditorDecorationType({});
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vs-focus" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.focus', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
        const editor = vscode.window.activeTextEditor;

        let startSelection = editor.selection.start;
        let endSelection = editor.selection.end;
        let startDocument = new vscode.Position(0,0);
        let endDocument = editor.document.lineAt(editor.document.lineCount - 1).rangeIncludingLineBreak.end;

        dt.dispose();

        if(editor.selections.length > 1 || startSelection.line != endSelection.line || startSelection.character != endSelection.character){
            //make position cuts
            let ranges = editor.selections.reduce((megaRange, selection) => {
                return cut(selection.start,selection.end, megaRange)
            }, [[startDocument, endDocument]]);

            //create regions from cut positions
            ranges = ranges.map((item) => {
                return new vscode.Range(item[0], item[1]);
            });

            //apply decorations
            let deco = {
                opacity: vscode.workspace.getConfiguration('vsfocus').get('opacity')+" !important",
            }
            let color = vscode.workspace.getConfiguration('vsfocus').get('color');
            if(color){
                deco.color = color;
            }

            dt = vscode.window.createTextEditorDecorationType(deco);

            editor.setDecorations(dt,
                ranges
            );
        }

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
