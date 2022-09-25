import React from 'react';
import ReactDOM from 'react-dom';
import RelCircle from '../RelCircle';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RelCircle />, div);
  ReactDOM.unmountComponentAtNode(div);
});
