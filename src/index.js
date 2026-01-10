const core = require('@actions/core')
const Message = require('./helpers/message')
const web = require('./web')
const cdn = require('./cdn')
const getCommitInfo = require('./helpers/git')

try {
  // 应用类型暂时只支持message、web
  const type = core.getInput('type')
  const robotKey = core.getInput('robotkey')
  const content = core.getInput('content')
  const input = core.getInput('input')

  const message = new Message(robotKey)

  const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE

  switch (type) {
    // web应用
    case 'web':
      var host = core.getInput('host')
      var port = core.getInput('port')
      var username = core.getInput('username')
      var password = core.getInput('password')
      var output = core.getInput('output')
      var script = core.getInput('script')
      var clean = core.getInput('clean') === 'true'
      var cleanPaths = core.getInput('cleanPaths')

      // 处理清理路径
      const cleanPathsArray = cleanPaths
        ? cleanPaths
            .split(',')
            .map(p => p.trim())
            .filter(Boolean)
        : []

      var newContent = content
      web({
        host: host,
        port: port,
        username: username,
        password: password,
        input: input,
        output: output,
        script: script,
        workspace: GITHUB_WORKSPACE,
        clean: clean,
        cleanPaths: cleanPathsArray
      })
        .then(text => {
          newContent = `${newContent}-${text}\nGitHub提交记录：\n${getCommitInfo()}`
          message.sendText(newContent)
          // setTimeout(() => {
          //   cdn()
          //     .cleanCache()
          //     .then(txt => {
          //       newContent = newContent + '(' + txt + ')'
          //       message.sendText(newContent)
          //     })
          //     .catch(txt => {
          //       newContent = newContent + '(' + txt + ')'
          //       message.sendText(newContent)
          //     })
          // }, 5000)
        })
        .catch(text => {
          newContent = newContent + '-' + text
          message.sendText(newContent)
        })
      break
    // 发送消息
    case 'message':
      if (!content) {
        return console.log('参数配置缺失，需要content')
      }
      message.sendText(content)
      break
    default:
      console.log('没有该类型')
  }
} catch (error) {
  core.setFailed(error.message)
}
