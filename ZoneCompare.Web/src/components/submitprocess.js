import React from 'react';
import { connect } from 'react-redux'
import Button from './button'
import {
    exceptionbulksave
} from '../actions/loaddata'

class SubmitProcess extends React.Component{
    render(){
        return (
            <div className={this.props.submitbuttonclassname} id={"divsubmit"}>
                <table className = {"maintdwidth100"}>
                    <tbody>
                        <tr>
                            <td><Button id={"btnsubmit"} value = {"Submit"} 
                            className = {''} onClick = {this.onSubmit}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )     
    }
    
    onSubmit = () => {
        if(this.props.isbulkprocess){
            this.props.exceptionbulksave(this.props.selected_component,
                                this.props.selected_paper,
                                -1,
                                this.props.results_data,this.props.rownum)
        } else {
            this.props.exceptionbulksave(-1,this.props.hiddenqpid,this.props.selected_csid,
                            this.props.results_data,this.props.rownum)
        }
    }
} 

const mapStateToProps= state =>{
    return { 
        selected_component : state.selected_component,
        selected_paper : state.selected_paper,
        selected_csid : state.selected_csid,
        results_data : state.correction_details,
        isbulkprocess : state.isbulkprocess,
        hiddenqpid : state.hiddenqpid,
        rownum : state.rownum
      };
  };

const mapDispatchToProps = dispatch => ({
    exceptionbulksave : (esessid,quespapid,csid,results_data,rownum) => 
        dispatch(exceptionbulksave(esessid,quespapid,csid,results_data,rownum))
})

export default connect (mapStateToProps,mapDispatchToProps)(SubmitProcess)