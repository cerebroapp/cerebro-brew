import { Loading, Preload, KeyboardNav, KeyboardNavItem } from '@cerebroapp/cerebro-ui'
import { getSuggestions } from './getSuggestions'


const wrapperStyles = {
  alignSelf: 'flex-start',
  width: '100%',
  margin: '-10px'
}

const listStyles = {
  margin: 0,
  padding: 0
}

type PreviewProps = {
  query: string;
  search: (term: string) => void;
  key: string;
}

export const Preview = ({ query, search }: PreviewProps) => (
  <Preload promise={getSuggestions(query)} loader={<Loading/>}>
    {(suggestions: string[]) => (
      <div style={wrapperStyles}>
        <KeyboardNav>
          <ul style={listStyles}>
            {
              suggestions.map(suggestion => (
                <KeyboardNavItem
                  key={suggestion}
                  tagName={'li'}
                  onSelect={() => search(suggestion)}
                >
                  {suggestion}
                </KeyboardNavItem>
              ))
            }
          </ul>
        </KeyboardNav>
      </div>
    )}
  </Preload>
)
