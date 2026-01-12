const vscode = require("vscode");

// 创建一个输出通道（日志通道）
const outputChannel = vscode.window.createOutputChannel("codemao-extension");

function activate(context) {
  // 在激活插件时显示输出通道
  outputChannel.show();

  // 在激活插件时记录一条日志信息
  outputChannel.appendLine("codemao-extension 启动!");

  // 注册激活事件
  let disposable = vscode.commands.registerCommand(
    "codemao-extension.checkSettings",
    function () {
      applySettings();
    }
  );

  context.subscriptions.push(disposable);

  applySettings();
}

function deactivate() {
  // 记录插件停用的日志信息
  outputChannel.appendLine("codemao-extension 结束!");
}

function applySettings() {
  const config = vscode.workspace.getConfiguration();

  // 禁用 formatOnSave，由 codeActionsOnSave 中的 source.formatDocument 接管
  config.update(
    "editor.formatOnSave",
    false,
    vscode.ConfigurationTarget.Workspace
  );

  // 使用数组形式，保证执行顺序：先格式化 → 再 ESLint → 再 Stylelint
  config.update(
    "editor.codeActionsOnSave",
    [
      "source.formatDocument",
      "source.fixAll.eslint",
      "source.fixAll.stylelint"
    ],
    vscode.ConfigurationTarget.Workspace
  );

  // ESLint 修复所有问题
  config.update(
    "eslint.codeActionsOnSave.mode",
    "all",
    vscode.ConfigurationTarget.Workspace
  );

  // Prettier 作为默认格式化工具
  config.update(
    "editor.defaultFormatter",
    "esbenp.prettier-vscode",
    vscode.ConfigurationTarget.Workspace
  );

  vscode.window.showInformationMessage(
    `已开启自动修复功能（顺序：Prettier → ESLint → Stylelint）`
  );
}

module.exports = {
  activate,
  deactivate,
};
