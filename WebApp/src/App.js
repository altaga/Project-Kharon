// Basic
import { Component } from "react";

// Router
import {
  Router,
  Route,
  Switch
} from "react-router-dom";

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Pages
import Main from "./pages/main";
import history from "./utils/history";
import Upload from "./pages/upload";
import Nft from "./pages/nft";
import Gallery from "./pages/gallery";
import Scan from "./pages/scan";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Devices from "./pages/devices";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/scan" component={Scan} />
            <Route exact path="/devices" component={Devices} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/nft" component={Nft} />
            <Route exact path="/nft/" component={Nft} />
            <Route exact path="/nft/:pub" component={Nft} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/terms" component={Terms} />
            <Route path="*" component={Main} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
