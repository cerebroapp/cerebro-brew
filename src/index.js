import React from 'react'
import Preview from './Preview'
import icon from './icon.png'

const tty = require('tty');
const child_process = require('child_process');

const id = 'brew'
const order = 1

function spawnchild(pkg, code) {
  var child = child_process.spawn('osascript', ['-e', 'tell application "Terminal" to activate', '-e', 'delay 1', '-e', 'tell application "System Events" to tell process "Terminal" to keystroke "v" using command down'], {
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.log('Failed to start child process.');
  });

  child.on('exit', function(e, code) {
    console.log("Finished");
  });
}

const queryFromTerm = term => {
  const match = term.match(/^brew (.+)$/);
  return match ? match[1].trim() : null;
};

const plugin = ({ term, actions, display }) => {
  const query = queryFromTerm(term);

  if (!query) {
    return null;
  }

  var search = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    actions.copyToClipboard(`brew install ${q}`)
    spawnchild(q,0)
    actions.hideWindow()
  }

  display({
    icon: icon,
    order: order, // High priority
    title: `Search Brew For ${query}`,
    clipboard: `brew install ${query}`,
    onSelect: () => search(term),
    getPreview: () => <Preview query={query} key={query} search={search} />
  })
}

module.exports = {
  fn: plugin
}
