import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import axios from 'axios';
import '../App.css'; 
import ReactGA from 'react-ga';

ReactGA.initialize('UA-132593989-2');
ReactGA.pageview(window.location.pathname + window.location.search);

class Main extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            defaultImg: 'images/defaultProfileImg.jpg',
            query: ""
        }
    }

    componentDidMount(){
        axios.get(`db/people`)
        .then((response)=>{
            this.setState({data: response.data});
            console.log(response.data);
        }).catch(err=>{
            console.log(err);
        })
    }
    
    onChange = (query) => {
        this.setState({query: query.toLowerCase()});
    }
   


    render(){

        return(
            <div className="container">

            <InputGroup>
                <Input onChange={evt=>this.onChange(evt.target.value)} placeholder="Search" id="searchInput"/>
                <InputGroupAddon addonType="append" >
                {/* <Button id="searchButton" color="secondary"><img src="images/search.svg" id="searchImg"/></Button> */}
                </InputGroupAddon>
            </InputGroup>

               <div className="row">
                   {
                       this.state.data && this.state.data.map((elem)=>{
                            let name = elem[0].name.toLowerCase();
                            let desc = elem[0].desc.toLowerCase();
                            if(name.includes(this.state.query) || desc.includes(this.state.query)) {
                            return <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                                        <div className="dataBox">
                                        <div className="profileImgBox"><img className="profileImg" src={elem[0].img ? elem[0].img : this.state.defaultImg} /></div>
                                        <div className="name">{elem[0].name}</div>
                                        <div className="desc">{elem[0].desc}</div>
                                        </div>
                                    </div>
                            }
                            
                               
                           
                           
                        
                       })
                   }
                  

               </div>
            </div>
        )
    }
}


export default Main;

