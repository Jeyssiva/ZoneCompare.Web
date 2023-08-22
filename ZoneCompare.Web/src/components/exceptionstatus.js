import React from 'react';
import Modal from 'react-awesome-modal';
import DropDownList from './dropdownlist';
import { connect } from 'react-redux';
let classNames = require('classnames')
import Button from './button'
import {
    storeexceptionbaseddocpageid,
    openexceptionstatusdialog,
    changecomments
} from '../actions/loaddata'

export class ExceptionStatus extends React.Component{
    render () {
        const { isexceptionstatusopen, 
                exceptionlist, 
                iscmtmandatory,
                selected_docpageid,
                selected_exception_id } = this.props

        let classnames = classNames('ui-dialog ui-widget ui-widget-content ui-corner-all ui-front excepstatus-dialog ui-draggable ui-resizable',
                                {'controlblock' : isexceptionstatusopen},
                                {'controlnone' : !isexceptionstatusopen})
        
        // let iscmtmandatory = exceptionlist && selected_exception_id != -1 && 
        //                     exceptionlist.filter(function(v,i,a){return v[0] == selected_exception_id})[0][2]
        let cmtclassnames = classNames({'whitecolor' :!iscmtmandatory},
                                        {'redcolor' : iscmtmandatory})

        return(
            <div id={"exceptionstatus"}>
                <Modal visible = {isexceptionstatusopen} 
                        width={"263"}
                        height={"300"}
                        effect={"fadeInUp"}>
                    <div className={"ui-dialog ui-widget ui-widget-content ui-corner-all ui-front excepstatus-dialog ui-draggable ui-resizable excepstatussize"}>
                        <div className={"ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix ui-draggable-handle"}>
                            <span id={"ui-id-1"} className={"ui-dialog-title"}>Exception Status</span>
                        </div>
                        <table >
                            <tbody>
                                <tr>                
                                    <td><label id={"lblexception"}>Exception:</label>
                                    <label className={'redcolor'}>*</label></td>
                                </tr>
                                <tr>
                                    <td> <DropDownList id = {"drpexcep"} 
                                    isbulkprocess = {true}
                                    defaultvalue= {"Select Exception"}
                                    valuelist = {exceptionlist}
                                    selectedvalue = {this.props.selected_exception_id}/>
                                    </td>           
                                </tr>
                                <tr>
                                    <td><label>Comments:</label>
                                    <label id={"cmdstar"} className={cmtclassnames}>*</label>
                                    </td> 
                                </tr>
                                <tr>
                                    <td><textarea 
                                        className ={'clstextarea'} 
                                        id={"txtareacomment"}
                                        value = {this.props.commentsbypage}
                                        ref="textarea"
                                        onChange={this.handleChange}></textarea></td>
                                </tr>
                                <tr>
                                    <td><Button id={"btnok"} 
                                            value={"OK"} 
                                            className={null}
                                            onClick={this.onOkClick.bind(this,selected_exception_id,selected_docpageid)}/>
                                        <Button id={"btncancel"} 
                                            value={"Cancel"} 
                                            className={null}
                                            onClick={this.onCancelClick}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>   
                </Modal>
            </div>
        )
    }

    handleChange = (e) =>{
        this.props.changecomments(e.target.value)
    }

    onOkClick (selected_exception_id,selected_docpageid) {
        let commentvalue = this.refs.textarea.value
        if(selected_exception_id != -1 && (!this.props.iscmtmandatory ||(this.props.iscmtmandatory && commentvalue != '')))            {
            this.props.storeexceptionbaseddocpageid(0,selected_docpageid,selected_exception_id,commentvalue)    
        } else {
            alert ('Please fill required fields')
        }
    }

    onCancelClick = (e) => {
        this.props.openexceptionstatusdialog(0,false)
    }
}

const mapStateToProps= state =>{
    return { 
        isexceptionstatusopen : state.isexceptionstatusopen,
        selected_docpageid : state.selected_docpageid,
        exceptionlist : state.exceptionlist,
        selected_exception_id : state.selected_exception_id,
        iscmtmandatory : state.iscmtmandatory,
        success : state.success,
        commentsbypage : state.commentsbypage
      };
};

const mapDispatchToProps = dispatch =>{
    return {
        storeexceptionbaseddocpageid : (accuracystatusid,selected_docpageid,exceptionid,comments) => 
        dispatch(storeexceptionbaseddocpageid(accuracystatusid,selected_docpageid,exceptionid,comments)),

        openexceptionstatusdialog : (docpageid,isdialogopen) => 
        dispatch(openexceptionstatusdialog(docpageid,isdialogopen)),

        changecomments : (comments) => dispatch(changecomments(comments))
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (ExceptionStatus);