import React from 'react';
import { connect } from 'react-redux'
import {
    loadseries,
    loadexceptions,
    loadcomponent,
    get_selected_session
} from '../actions/loaddata'
import SearchCriteria from './searchcriteria'
import SearchFilter from './searchfilter'
import PageDetails from './pagedetails'
import DynamicZoneWrapper from './zonewrapperdynamic'
import ZoneHeading from './zoneheading';
import SubmitProcess from './submitprocess'

let classnames = require('classnames')

class MainSearch extends React.Component{
    render(){

        const {isbulkprocess, 
            serieslist,
            selected_csid,
            pagecount, 
            isshowpagedetails,
            isskipbuttonvisible,
            issubmitbuttonvisible,
            iszoneheadingvisibe,
            } = this.props

        let submitbuttonclassname = classnames('maintdwidth100', 
                                {'controlblock' : issubmitbuttonvisible},
                                {'controlnone' : !issubmitbuttonvisible})

        let zoneheadingvisible = iszoneheadingvisibe ? "controlblock" : "controlnone"

        return( 
        <div id={"main"}>
            <input type={"hidden"} id={"qpid"}></input>
            <input type={"hidden"} id={"rownum"}></input>
            
            <div>
                <div id={"searchcriteria"} className={"div-border"}>
                    <br/>
                    <SearchCriteria isbulkprocess = {isbulkprocess} />
                    <SearchFilter isbulkprocess = {isbulkprocess} serieslist = {serieslist}/>
                </div>
            </div>
            <br></br>
            <div id={"notes"} className={"leftmargin5"}><b>{"Note: The purpose of this tool is to compare the auto zoning accuracy by comparing against manual zoning, \
                if mismatch found, please raise an appropriate exception by unticking the checkbox."}</b>
            </div>
            <br></br>
                <PageDetails selected_csid = {selected_csid} 
                pagecount = {pagecount} 
                isshowpagedetails = {isshowpagedetails}
                isskipbuttonvisible = {isskipbuttonvisible}/>
            <br></br>
            <div id={"zonewrapper-main"}>
                <ZoneHeading iszoneheadingvisibe = {zoneheadingvisible}/>
                <br></br>
                <div className="zonewrapper"> 
                    <DynamicZoneWrapper key = {"key_zonewrapperdynamic"} id = {"zonewrapperdynamic"} 
                    className = {this.props.isdynamiczonevisibe ? "controlblock" : "controlnone"}/>
                    
                    <SubmitProcess submitbuttonclassname = {submitbuttonclassname} />
                </div>
            </div>
        </div>           
        )
    }

    componentDidMount(){
         //this.props.loadseries()
         this.props.loadexceptions()
         this.props.loadcomponent(70)
         this.props.getselectedsession(70)
    }
}

const mapStateToProps= state =>{
  return { 
      isbulkprocess : state.isbulkprocess,
      serieslist : state.serieslist,
      selected_csid : state.selected_csid,
      pagecount : state.pagecount,
      isshowpagedetails : state.isshowpagedetails,
      isskipbuttonvisible : state.isskipbuttonvisible,
      issubmitbuttonvisible : state.issubmitbuttonvisible,
      iszoneheadingvisibe : state.iszoneheadingvisibe,
      isdynamiczonevisibe : state.isdynamiczonevisibe
    };
};

const mapDispatchToProps = dispatch => ({
    loadseries : () => dispatch(loadseries()),
    loadexceptions : () => dispatch(loadexceptions()),
    loadcomponent : (seriesid) => dispatch(loadcomponent(seriesid)),
    getselectedsession : (seriesid) => dispatch(get_selected_session(seriesid)),
})

export default connect(mapStateToProps,mapDispatchToProps)(MainSearch);