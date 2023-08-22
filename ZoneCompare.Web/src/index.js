// require("../content/css/style.css")
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from "react-redux";
import store from '../src/store';
import App from './app'

const Main = () => (
  <Provider store={store}>
    <App/>
  </Provider>
);

ReactDOM.render(<Main />, document.getElementById("root"));
