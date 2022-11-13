import { Preview } from './Preview'
import icon from './icon.png'
import { spawn } from 'node:child_process'
import { getSuggestions } from "./Preview/getSuggestions";

const order = 1

function spawnTerminal() {
  spawn('osascript',
    ['-e', 'tell application "Terminal" to activate', '-e', 'delay 1', '-e', 'tell application "System Events" to tell process "Terminal" to keystroke "v" using command down'],
    { stdio: 'ignore' }
  );
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

  const search = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    actions.copyToClipboard(`brew install ${q}`)
    spawnTerminal()
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

export default {
  name: 'Brew Search',
  icon,
  initialize: () => { getSuggestions("") },
  fn: plugin,
  keyword: 'brew'
}
