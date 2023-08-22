import React from 'react';
import { connect } from 'react-redux'
import { ActionTypes } from '../constants/appconstants.js'
import {
    getcandidatescripts
} from '../actions/loaddata'
import Button from './button'

class PageDetails extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
        const ispagedetailsvisible = this.props.isshowpagedetails ? "controlblock" : "controlnone"
        const isskipbuttonvis = this.props.isskipbuttonvisible ? "controlblock" : "controlnone"

      return (  
        <div id={"divpagedetails"} className ={ispagedetailsvisible}>
            <table >
                <tbody>
                    <tr>
                        <td><b>Candidate Script Id : </b></td>
                        <td><b><label id={"lblcsid"}>{this.props.selected_csid}</label></b></td>
                        <td><b>Page Count : </b></td>
                        <td><b><label id={"lblpagecount"}>{this.props.pagecount}</label></b></td>
                        <td className = {"pagedettdwidth10"}></td>
                        <td><Button id={"btnskip"} className={isskipbuttonvis} 
                            value ={"Skip"} onClick = {this.onSkipClick}/></td>
                    </tr>
                </tbody>
            </table>
        </div>
      )
    }

    onSkipClick = (e) => {
        if (confirm('All actions made against this response will be lost. Do you want to proceed?')){
            this.props.getcandidatescripts(this.props.selected_component,this.props.selected_paper,
                this.props.selected_csid,false,true,this.props.rownum)
        }
    }
}

const mapStateToProps= state =>{
    return { 
        selected_component : state.selected_component,
        selected_paper : state.selected_paper,
        rownum : state.rownum
    }
}

const mapDispatchToProps = dispatch => ({
    getcandidatescripts : (esessid,quespapid,csid,isprev,isnext,rownum) => 
        dispatch(getcandidatescripts(esessid,quespapid,csid,isprev,isnext,rownum))
})

export default connect(mapStateToProps,mapDispatchToProps)(PageDetails)