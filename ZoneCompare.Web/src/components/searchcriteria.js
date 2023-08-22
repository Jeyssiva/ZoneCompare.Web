import React from 'react';
import { connect } from 'react-redux'
import { ActionTypes } from '../constants/appconstants.js'

class SearchCriteria extends React.Component{
    render(){
        return (
            <div>
                <span className={"setfont_size leftmargin3"}>Search Criteria :</span> 
                <input 
                    type={"radio"} 
                    id={"rdobulk"} 
                    name={"searchcre"} 
                    checked = {this.props.isbulkprocess} 
                    onChange={this.onBulkProcessClicked.bind(this,true)}
                    ></input> 
                <span className={"setfont_size"}>Bulk Processing</span>
                <input type={"radio"} 
                        id={"rdosearchid"} 
                        name={"searchcre"} 
                        checked={!this.props.isbulkprocess}
                        onChange={this.onBulkProcessClicked.bind(this,false)}
                        ></input>
                <span className={"setfont_size"}>Individual Search ID</span>     
            </div>
        )
    };

    onBulkProcessClicked(isBulkProcess) {
        this.props.dispatch({
            type: ActionTypes.SEARCH_BASED_ON,
            payload: {
                isbulkprocess : isBulkProcess
                }
          });
    };
}

const mapStateToProps= state =>{
    return { 
        
      };
  };

export default connect(mapStateToProps)(SearchCriteria);  