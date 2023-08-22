import React from 'react';
import { connect } from 'react-redux'
import {
    loadcomponent,
    get_selected_session,
    loadquespaper,
    get_selected_component,
    get_selected_paper,
    selectedexceptionstatus
} from '../actions/loaddata'

class DropDownList extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
        let valueList ;
        let defaultvalue;

        if(this.props.id != "drpseries"){
            valueList = (this.props.valuelist && this.props.valuelist.map((item) => {
                return (<option key={item[0] +'_key'} value={item[0]}>{item[1]}</option>)
            }))
        } else {
           valueList = <option key={'1_key'} value={70}>{"M18"}</option>
        }

        if(this.props.id == "drpcomp" || this.props.id == "drpexcep"){
            defaultvalue = <option value = {-1}>{this.props.defaultvalue}</option>  
        } else {
            defaultvalue = null
        }

        return (
            <select id={this.props.id} 
            className={this.props.className} 
            disabled = {!this.props.isbulkprocess}
            onChange= {this.onDropDownChanged}
            value = {this.props.selectedvalue}>
            {defaultvalue}
            {valueList}
            </select>
        )
    }

    onDropDownChanged = (e) =>{
        if(this.props.id == "drpseries"){    
            this.props.getselectedsession(e.target.value) //Seriesid
            this.props.loadcomponent(e.target.value) //Seriesid
        }else if(this.props.id == "drpcomp")   {
            this.props.getselectedcomponent(e.target.value) //Componentid
            this.props.loadquespaper(e.target.value) //Componentid
        }else if(this.props.id == "drppaper"){
            this.props.getselectedpaper(e.target.value) // PaperId
        }else if(this.props.id == "drpexcep"){
            this.props.selectedexceptionstatus(e.target.value) // Exceptionid
        }
    };
}

const mapDispatchToProps = dispatch => ({
    loadcomponent : (seriesid) => dispatch(loadcomponent(seriesid)),
    getselectedsession : (seriesid) => dispatch(get_selected_session(seriesid)),
    loadquespaper : (esid) => dispatch(loadquespaper(esid)),
    getselectedcomponent : (esid) => dispatch(get_selected_component(esid)),
    getselectedpaper : (qpid) => dispatch(get_selected_paper(qpid)),
    selectedexceptionstatus : (exceptionid) => dispatch(selectedexceptionstatus(exceptionid))
})

export default connect(null,mapDispatchToProps)(DropDownList);  