import React from 'react';
import { connect } from 'react-redux'
import DropDownList from './dropdownlist'
import Button from './button'
import {
    get_cs_id,
    getcandidatescripts
} from '../actions/loaddata'


class SearchFilter extends React.Component{
    render(){
        const {componentlist, paperlist} = this.props

        return (
            <div className={"leftmargin4"}> 
            <br/>
            <table>
                <tbody>
                    <tr>
                        <td className={"setfont_size"}>Series:</td>
                        <td>
                            <DropDownList id={"drpseries"} 
                            className={"custom-select"}  
                            isbulkprocess = {this.props.isbulkprocess}    
                            valuelist = {this.props.serieslist}
                            defaultvalue={"Select Session"}></DropDownList>
                        </td>
                        <td className={"spacebwtd"}></td>
                        <td className={"setfont_size"}>CSID:</td>
                        <td>
                            <input type={"text"} 
                                id={"txtcsid"} 
                                ref = "input"
                                disabled = {this.props.isbulkprocess} 
                                onChange = {this.handleChange}>
                            </input>
                        </td>
                    </tr>
                    <tr className={"break"}><td colSpan={"5"}></td></tr>          
                    <tr>
                        <td className={"setfont_size"}>Component:</td>
                        <td><DropDownList id = {"drpcomp"} 
                            isbulkprocess = {this.props.isbulkprocess} 
                            valuelist = {componentlist}
                            defaultvalue = {"Select Component"}></DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td className={"setfont_size"}>Paper:</td>
                        <td><DropDownList id = {"drppaper"} 
                            isbulkprocess = {this.props.isbulkprocess} 
                            valuelist = {paperlist}
                            defaultvalue = {"Select Paper"}></DropDownList>
                        </td>
                        <td className={"spacebwtd"}></td>
                        <td></td>
                        <td><Button id={"btnsearch"} 
                                value={"Search"} 
                                className={null}
                                onClick={this.onClick}></Button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        )
    }
    
    handleChange = (e) =>{
        this.props.getcsid(e.target.value)
    }

    onClick = () => {
        if((this.props.isbulkprocess && this.props.selected_paper == -1) || (
            !this.props.isbulkprocess && this.refs.input.value == '')){
                alert('Please fill search criteria')
            }
        else {
            if(this.props.isbulkprocess){
                this.props.getcandidatescripts(this.props.selected_component,this.props.selected_paper,
                -1,false,false,1)
            } else {
                this.props.getcandidatescripts(-1,-1,this.props.selected_csid,false,false,1)
            }
        }
    }
}

const mapStateToProps= state =>{
    return {
        componentlist : state.componentlist,
        paperlist:state.paperlist,
        selected_component : state.selected_component,
        selected_paper : state.selected_paper,
        selected_csid : state.selected_csid,
        isbulkprocess : state.isbulkprocess
      };
  };

const mapDispatchToProps = dispatch =>{
    return {
        getcsid : (csid) => dispatch(get_cs_id(csid)),
        getcandidatescripts : (esessid,quespapid,csid,isprev,isnext,rownum) => 
        dispatch(getcandidatescripts(esessid,quespapid,csid,isprev,isnext,rownum))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SearchFilter);  