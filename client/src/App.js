import React from 'react';
import Main from './components/Main'
// import ReactGA from 'react-ga';

// ReactGA.initialize('UA-132593989-1');
// ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

    constructor(props){
        super(props);

        this.state = {

        }
    }

    componentDidMount(){

    }
    
   


    render(){

        return(
            <div>
                <div id="navbar">
                    <div id="navbarBrand"><img id="navBrandImg" src="images/logo.jpg"/></div>
                </div>
                <Main/>
            </div>
        )
    }
}


export default App;

