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
      checkAndApplySettings();
    }
  );

  context.subscriptions.push(disposable);

  // 在扩展激活时立即检查设置
  checkAndApplySettings();
}

function deactivate() {
  // 记录插件停用的日志信息
  outputChannel.appendLine("codemao-extension 结束!");
}

function checkAndApplySettings() {
  vscode.window
    .showInformationMessage(
      "您未设置stylelint和eslint的自动修复功能，是否开启？",
      "确认",
      "取消"
    )
    .then((selection) => {
      if (selection === "确认") {
        // 更新设置
        applySettings(updateMessage);
      }
    });
}

// 在applySettings函数中，修正对象打印方式
function applySettings(updateMessage) {
  const config = vscode.workspace.getConfiguration();

  // 获取并打印codeActionsOnSaveConfig对象
  const codeActionsOnSaveConfig = config.get("editor.codeActionsOnSave") || {};

  // 更新codeActionsOnSaveConfig对象
  codeActionsOnSaveConfig["source.fixAll.eslint"] = "true"; // 注意，这里应该是布尔值true，而不是字符串"true"
  codeActionsOnSaveConfig["source.fixAll.stylelint"] = "true"; // 同上

  // 更新editor.codeActionsOnSave设置
  config.update(
    "editor.codeActionsOnSave",
    codeActionsOnSaveConfig,
    vscode.ConfigurationTarget.Workspace
  );

  // 获取并打印stylelint.validate设置
  let stylelintConfig = config.get("stylelint.validate") || [];

  // 更新stylelint.validate设置
  if (!stylelintConfig.includes("css")) stylelintConfig.push("css");
  if (!stylelintConfig.includes("less")) stylelintConfig.push("less");
  if (!stylelintConfig.includes("scss")) stylelintConfig.push("scss");

  // 更新stylelint.validate设置
  config.update(
    "stylelint.validate",
    stylelintConfig,
    vscode.ConfigurationTarget.Workspace
  );

  // 显示更新提示
  vscode.window.showInformationMessage(`已更新设置：${updateMessage}`);
}

module.exports = {
  activate,
  deactivate,
};
