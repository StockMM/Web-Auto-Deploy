const { execSync } = require('child_process')

/**
 * Get the latest git commit information
 * @returns {string} Formatted commit info
 */
const getCommitInfo = () => {
  try {
    const hash = execSync('git rev-parse --short HEAD').toString().trim()
    const author = execSync('git log -1 --pretty=format:"%an"').toString().trim()
    const message = execSync('git log -1 --pretty=format:"%B"').toString().trim()

    return `\n 提交Id: ${hash}\n提交者: ${author}\n更新内容: \n${message}`
  } catch (e) {
    // Fail silently or log warning if git command fails (e.g. not a git repo)
    return ''
  }
}

module.exports = getCommitInfo
