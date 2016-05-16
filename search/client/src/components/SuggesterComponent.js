'use strict';

import React from 'react';
import fetch from 'isomorphic-fetch';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlight from 'autosuggest-highlight';

require('styles//Suggester.sass');

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// function renderSuggestion(suggestion) {
//   return (
//     <span>{suggestion.text}, {suggestion.classification}</span>
//   );
// }

function renderSuggestion(suggestion, { value, valueBeforeUpDown }) {
  const suggestionText = suggestion.text;
  const query = (valueBeforeUpDown || value).trim();
  const matches = AutosuggestHighlight.match(suggestionText, query);
  const parts = AutosuggestHighlight.parse(suggestionText, matches);

  let classificationText = {
    'organization': 'hospital/center',
    'organization_family': 'network/organization',
    'disease': 'disease',
    'location': 'location'
  }[suggestion.classification];

  return (
    <span className={'suggestion-content ' + suggestion.classification}>
      <span className='text'>
        {
          parts.map((part, index) => {
            const className = part.highlight ? 'suggester-highlight' : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
      <span className='suggestion-classification'>&nbsp;({classificationText})</span>
    </span>
  );
}

function getSuggestionValue(suggestion) { // when suggestion selected, this function tells
  return suggestion.text;                 // what should be the value of the input
}

class SuggesterComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  loadSuggestions(value) {
    this.setState({});

    let term = escapeRegexCharacters(value);
    fetch(`http://localhost:3000/search/terms?term=${term}`)
      .then(response => response.json())
      .then((json) => {
        var suggestions = json.terms;
        // console.log(suggestions);
        if (value === this.state.value) {
          this.setState({
            suggestions
          });
        } else { // Ignore suggestions if input value changed
          this.setState({});
        }
      });
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.loadSuggestions(suggestionValue);
  }

  onSuggestionsUpdateRequested({ value }) {
    this.loadSuggestions(value);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'enter a disease, location, or organization',
      value,
      onChange: this.onChange
    };

    return (
      <div className="suggestion-component">
        <Autosuggest suggestions={suggestions}
                     onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     inputProps={inputProps} />
        <div className='search-icon'>
          <img src='images/search-icon.svg' />
        </div>
      </div>
    );
  }
}

SuggesterComponent.displayName = 'SuggesterComponent';

// Uncomment properties you need
// SuggesterComponent.propTypes = {};
// SuggesterComponent.defaultProps = {};

export default SuggesterComponent;
