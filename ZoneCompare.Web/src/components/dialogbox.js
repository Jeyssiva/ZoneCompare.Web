import React from 'react';
import { connect } from 'react-redux'
import Button from './button'
import {
    opendialogbox
} from '../actions/loaddata'
import Modal from 'react-awesome-modal';

class DialogBox extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){ 
        let message = this.props.success_retrivescripts == "no scripts" ? "No scripts are available!" :
        "Autozoning is not completed";

        return (<div id={"dialogbox"}>
                <Modal visible = {this.props.isdialogboxopen} 
                        width={"100"}
                        height={"85"}
                        effect={"fadeInUp"}>
                    <div className={"ui-dialog ui-widget ui-widget-content ui-corner-all ui-front excepstatus-dialog ui-draggable ui-resizable dialogboxsize" }>
                        <div className={"ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix ui-draggable-handle dialogboxtitlehead"}>
                            <span id={"ui-id-1"} className={"ui-dialog-title dialogboxtitle"}>Information</span>
                        </div>
                        <br></br>
                       <div className={"dialogboxinfo"}>{message}</div>
                       <Button id={"btnok"} 
                            value={"OK"} 
                            className={"dialogboxbutton"}
                            onClick={this.onOkClick.bind(this)}/>
                    </div>   
                </Modal>
            </div>)
    }

    onOkClick () {
            this.props.opendialogbox(false)
    }
}

const mapStateToProps= state =>{
    return { 
        success_retrivescripts : state.success_retrivescripts,
        isdialogboxopen : state.isdialogboxopen
    };
};

const mapDispatchToProps = dispatch =>{
    return {  
        opendialogbox : (isdialogopen) => dispatch(opendialogbox(isdialogopen))
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (DialogBox);