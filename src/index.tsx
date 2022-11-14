import { Preview } from './Preview'
import icon from './icon.png'
import { exec } from 'node:child_process'
import { getSuggestions } from "./Preview/getSuggestions";

const order = 1

function spawnTerminal(command: string, terminal: 'iTerm' | 'Terminal' = 'Terminal', execute = false) {
  console.log("Spawning terminal with command: " + terminal + ', ' + command)
  if (terminal === 'Terminal') {
    const scriptCommand = execute ?
      `tell application "Terminal" to do script "${command}"` :
      `tell application "System Events" to tell process "Terminal" to keystroke "${command}"`

    exec(`osascript -e \
    'tell application "Terminal" to activate
    ${scriptCommand}'`, (err) => console.error(err))
  } else {
    exec(`osascript -e 'tell application "iTerm"
      if not (exists window 1) then
        reopen
      else
        tell current window
          create tab with default profile
        end tell
      end if

      activate

      tell first session of current tab of current window
        write text "${command}" ${execute ? '' : 'without newline'}
      end tell
    end tell'`, (err) => console.error(err));
  }
}

const queryFromTerm = term => {
  const match = term.match(/^brew (.+)$/);
  return match ? match[1].trim() : null;
};

const plugin = ({term, actions, display, settings}) => {
  const query = queryFromTerm(term);

  if (!query) {
    return null;
  }

  const search = (searchTerm) => {
    const query = encodeURIComponent(searchTerm)
    actions.copyToClipboard(`brew install ${query}`)
    spawnTerminal(`brew install ${query}`, settings.terminal.value || settings.terminal, settings.executeAutomatically)
    actions.hideWindow()
  }

  display({
    icon: icon,
    order: order, // High priority
    title: `Search Brew For ${query}`,
    clipboard: `brew install ${query}`,
    onSelect: () => getSuggestions(query).then((results) => results?.length && search(results[0])),
    getPreview: () => <Preview query={query} key={query} search={search}/>
  })
}

export default {
  name: 'Brew Search',
  icon,
  initialize: () => {
    getSuggestions("", true)
  },
  fn: plugin,
  keyword: 'brew',
  settings: {
    terminal: {
      label: 'Terminal',
      type: "option",
      description: "Terminal to use for brew commands",
      defaultValue: {value: "Terminal", label: "Terminal"},
      options: [
        {
          label: "iTerm",
          value: "iTerm"
        },
        {
          label: "Terminal",
          value: "Terminal"
        }
      ]
    },
    executeAutomatically: {
      label: 'Execute Automatically',
      type: "bool",
      description: "Execute brew command automatically",
      defaultValue: false
    }
  }
}
