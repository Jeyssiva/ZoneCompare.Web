import React from 'react';
import { connect } from 'react-redux'
import DynamicZone from './dynamcizone'

class DynamicZoneWrapper extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){      
        const { scriptdetails } = this.props

        let scriptdetailsdyn =  (scriptdetails && scriptdetails.map((item) => {
            return (<DynamicZone key = {"key_" + item[0]} docpageid={item[0]} 
                ischecked = {item[3]}
                autozone_images = {item[1]}
                manualzone_images = {item[2]}
                isexceptioniconvisible = {item[3]}></DynamicZone>)
        }));

       return ( <div id={this.props.id} className ={this.props.className}>
          {scriptdetailsdyn}
        </div>)
    }
} 

const mapStateToProps= state =>{
    return { 
        scriptdetails : state.scriptdetails,
        renderedOn : state.renderedOn
    };
};
export default connect(mapStateToProps) (DynamicZoneWrapper);