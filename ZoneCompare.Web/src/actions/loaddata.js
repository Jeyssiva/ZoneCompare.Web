import { Dispatch } from 'redux';
import $  from 'jquery';
import { ActionTypes } from '../constants/appconstants.js'

export const loadseries = () => {
    return dispatch => {
        $.ajax({
            url:"/api/series/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            async: true,
            success: function(data) {            
                return dispatch({
                type: ActionTypes.LOAD_SERIES,
                payload : {
                    serieslist : data
                }
                })
            },
            error: function(error) {
                console.log(error)
            }
        });
    }
}

export const loadexceptions = () => {
    return dispatch => {
        $.ajax({
            url:"/api/exceptionstatus/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            async: true,
            success: function(data) {            
                return dispatch({
                type: ActionTypes.LOAD_EXCEPTIONS,
                payload : {
                    exceptionlist : data
                }
                })
            },
            error: function(error) {
                console.log(error)
            }
        });
    }
}

export const loadcomponent = (seriesid) => {
    return dispatch => {
        $.ajax({
            url:"/api/component/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            async: true,
            data : {
                sessionid : seriesid
            },
            success: function(data) {            
                return dispatch({
                type: ActionTypes.LOAD_COMPONENTS,
                payload : {
                    componentlist : data
                }
                })
            },
            error: function(error) {
                console.log(error)
            }
        });
    }
}

export const get_selected_session = (seriesid) =>{
    return dispatch => {
        dispatch ({           
        type: ActionTypes.SELECTED_SESSION,
        payload: {
            selected_session : seriesid
            }
        })
    };
}

export const loadquespaper = (esid) => {
    return dispatch => {
        $.ajax({
            url:"/api/questionpaper/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            async: true,
            data : {
                esid : esid
            },
            success: function(data) {            
                return dispatch({
                type: ActionTypes.LOAD_PAPERS,
                payload : {
                    paperlist : data
                }
                })
            },
            error: function(error) {
                console.log(error)
            }
        });
    }
}

export const get_selected_component = (esid) =>{
    return dispatch => {
        dispatch ({           
        type: ActionTypes.SELECTED_COMPONENT,
        payload: {
            selected_component : esid
            }
        })
    };
}

export const get_selected_paper = (paperid) =>{
    return dispatch => {
        dispatch ({           
        type: ActionTypes.SELECTED_PAPER,
        payload: {
            selected_paper : paperid
            }
        })
    };
}

export const get_cs_id = (csid) =>{
    return dispatch => {
        dispatch({
            type :ActionTypes.SELECTED_CS_ID,
            payload: {
                selected_cs_id : csid
            }
        })
    }
}

export const getcandidatescripts = (esessid,quespapid,csid,isprev,isnext,rownum) => {
    return dispatch => {
        $.ajax({
            url:"/api/candidatescriptids/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            data : {
                esid : esessid,
                qpid: quespapid,
                csid : csid,
                isprev : isprev,
                isnext : isnext,
                rownum : rownum
            },
            async: true,
            beforeSend:function(){
                return dispatch ({                
                    type :ActionTypes.IS_BUSY_INDICATOR_OPEN,
                    payload: {
                        isBusyIndicatorOpen : true
                    }
                })
            },
            success: function(data) {
                return dispatch({
                    type: ActionTypes.SCRIPT_DETAILS,
                    payload : {
                        scriptdetails : data
                    }
                })
            },
            error: function(error) {
                alert(error)
            },
            complete: function(){
                return dispatch ({                
                    type :ActionTypes.IS_BUSY_INDICATOR_OPEN,
                    payload: {
                        isBusyIndicatorOpen : false
                    }
                })
            }
        });
    }

    // return dispatch => {
    //     dispatch({
    //         type : ActionTypes.SELECTED_EXCEPTION_STATUS,
    //         payload: {
    //             selecteddocpageid : "24",
    //             isdialogopen : true
    //         }
    //     })
    // }
}

export const openexceptionstatusdialog = (docpageid,isdialogopen,editmode) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.OPEN_EXCEPTION_DIALOG,
            payload: {
                selected_docpageid : docpageid,
                isdialogopen : isdialogopen,
                iseditmode : editmode
            }
        })
    }
}

export const selectedexceptionstatus = (exceptionid) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.SELECTED_EXCEPTION_STATUS,
            payload: {
                exceptionid : exceptionid
            }
        })
    }
}

export const storeexceptionbaseddocpageid = (accuracystatusid,docpageid,exceptionid,comments) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.ADD_EXCEPTION_DOCPAGEID,
            payload: {
                accuracystatusid : accuracystatusid,
                docpageid : docpageid,
                exceptionid : exceptionid,
                comments : comments
            }
        })
    }
}

export const exceptionbulksave = (esessid,quespapid,csid,results_data,rownum) =>{
    return dispatch => {
        $.ajax({
            url:"/api/exceptionsavebulk/",
            crossDomain: true,
            type: 'GET',
            dataType: 'JSON',
            data : {
                esid : esessid,
                qpid: quespapid,
                csid : csid,
                rownum : rownum,
                results : JSON.stringify(results_data)
            },
            async: true,
            beforeSend:function(){
                return dispatch ({                
                    type :ActionTypes.IS_BUSY_INDICATOR_OPEN,
                    payload: {
                        isBusyIndicatorOpen : true
                    }
                })
            },
            success: function(data) {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                return dispatch({
                    type: ActionTypes.SCRIPT_DETAILS,
                    payload : {
                        scriptdetails : data
                    }
                })
            },
            error: function(error) {
                alert(error)
            },
            complete: function(data){
                return dispatch ({                
                    type :ActionTypes.IS_BUSY_INDICATOR_OPEN,
                    payload: {
                        isBusyIndicatorOpen : false
                    }
                })
            }        
        })
    }
}

export const changecomments = (comments) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.CHANGE_COMMENTS,
            payload: {
                commentsbypage : comments
            }
        })
    }
}

export const opendialogbox = (isdialogopen) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.OPEN_DIALOG_BOX,
            payload: {
                isdialogopen : isdialogopen
            }
        })
    }
}

export const resetexception = (r_docpageid) => {
    return dispatch => {
        dispatch({
            type : ActionTypes.RESET_EXCEPTION,
            payload: {
                docpageid : r_docpageid
            }
        })
    }
}