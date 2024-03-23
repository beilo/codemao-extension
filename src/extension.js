const vscode = require("vscode");

// 创建一个输出通道（日志通道）
const outputChannel = vscode.window.createOutputChannel("codemao-extension");

function activate(context) {
  // 在激活插件时显示输出通道
  outputChannel.show();

  // 在激活插件时记录一条日志信息
  outputChannel.appendLine("codemao-extension 启动!");

  context.subscriptions.push(disposable);

  applySettings();
}

function deactivate() {
  // 记录插件停用的日志信息
  outputChannel.appendLine("codemao-extension 结束!");
}

// 在applySettings函数中，修正对象打印方式
function applySettings() {
  const config = vscode.workspace.getConfiguration();

  // 获取并打印codeActionsOnSaveConfig对象
  const codeActionsOnSaveConfig = config.get("editor.codeActionsOnSave") || {};

  // 更新codeActionsOnSaveConfig对象
  codeActionsOnSaveConfig["source.fixAll.eslint"] = "true";
  codeActionsOnSaveConfig["source.fixAll.stylelint"] = "true";

  // 更新editor.codeActionsOnSave设置
  config.update(
    "editor.codeActionsOnSave",
    codeActionsOnSaveConfig,
    vscode.ConfigurationTarget.Workspace
  );

  // 显示更新提示
  vscode.window.showInformationMessage(
    `已开启 ESLint 和 StyleLint 的自动修复功能`
  );
}

module.exports = {
  activate,
  deactivate,
};
