require('normalize.css/normalize.css');
require('styles/App.sass');

import React from 'react';
import { Link, browserHistory } from 'react-router'
import SuggesterComponent from './SuggesterComponent';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="main-container">
          <div className="logo-container">
            Search Clinical Trials
          </div>
          <div className="search-container">
            <SuggesterComponent />
          </div>
        </div>
        <Link to="/clinical-trial">clinical-trial</Link>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
