import Modal from 'react-awesome-modal';
import React from 'react';
import { connect } from 'react-redux'

class Spinner extends React.Component{
    render(){
        const { isBusyIndicatorOpen } = this.props
        return (
            <div id={"spinner"}>
                <Modal visible = {isBusyIndicatorOpen} 
                        width={"80"}
                        height={"80"}
                        effect="fadeInUp">
                    <div  >
                        <img src={'/static/images/Spinner.gif'} className = {"spinneralignment"}/>
                    </div>
                </Modal>
            </div>    
        );
    }
}

const mapStateToProps= state =>{
    return { 
        isBusyIndicatorOpen : state.isBusyIndicatorOpen
      };
  };

export default connect(mapStateToProps) (Spinner);