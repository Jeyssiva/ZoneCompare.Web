import {
  ActionTypes
} from '../constants/appconstants.js'
import { string } from 'prop-types';


const initialstate = {
  isbulkprocess : true,
  serieslist: null,
  componentlist:null,
  paperlist:null,
  exceptionlist:null,
  selected_session : -1,
  selected_component : -1,
  selected_paper : -1,
  selected_csid : -1,
  pagecount:0,
  isBusyIndicatorOpen : false,
  scriptdetails : null,
  hiddenqpid : 0,
  rownum : 0,
  isshowpagedetails : false,
  issubmitbuttonvisible : false,
  isskipbuttonvisible : false,
  iszoneheadingvisibe : false,
  isdynamiczonevisibe : false,
  selected_docpageid : 0,
  isexceptionstatusopen : false,
  selected_exception_id : -1,
  iscmtmandatory : false,
  correction_details : [] = [],
  success : false,
  success_retrivescripts : '',
  isdialogboxopen : false,
  renderedOn : null,
  commentsbypage : ''
};

export const mainReducer = (state = initialstate, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_SERIES:
      return {
        ...initialstate,
        serieslist: action.payload.serieslist
      };
    case ActionTypes.LOAD_EXCEPTIONS:
      return {
        ...state,
        exceptionlist:action.payload.exceptionlist
      }
    case ActionTypes.SEARCH_BASED_ON:
      return {
        ...state,
        isbulkprocess : action.payload.isbulkprocess,
        isskipbuttonvisible : action.payload.isbulkprocess ? true : false
      };
    case ActionTypes.LOAD_COMPONENTS:
      return {
        ...state,
        componentlist : action.payload.componentlist
      }
    case ActionTypes.SELECTED_SESSION:
      return {
        ...state,
        selected_session : action.payload.selected_session
      }
    case ActionTypes.LOAD_PAPERS:
      return {
        ...state,
        paperlist : action.payload.paperlist,
        selected_paper : action.payload.paperlist[0][0]
      }
    case ActionTypes.SELECTED_COMPONENT:
      return {
        ...state,
        selected_component : action.payload.selected_component
      }
    case ActionTypes.SELECTED_PAPER:
      return {
        ...state,
        selected_paper : action.payload.selected_paper
      }
    case ActionTypes.SELECTED_CS_ID:
      return {
        ...state,
        selected_csid : action.payload.selected_cs_id
      }
    case ActionTypes.SCRIPT_DETAILS:
      const isskipbuttonvis = state.isbulkprocess ? true : false;
      if (action.payload.scriptdetails[0] == "no scripts"){
          return {
          ...state,
          isshowpagedetails : false,
          issubmitbuttonvisible : false,
          isskipbuttonvisible : false,
          iszoneheadingvisibe : false,
          isdynamiczonevisibe : false,
          success_retrivescripts : "no scripts",
          isdialogboxopen : true
          }      
      } else if(action.payload.scriptdetails[0] == "unzoned"){
          return {
          ...state,
          isshowpagedetails : false,
          issubmitbuttonvisible : false,
          isskipbuttonvisible : false,
          iszoneheadingvisibe : false,
          isdynamiczonevisibe : false,
          success_retrivescripts : "unzoned",
          isdialogboxopen : true
          }
      } else if(action.payload.scriptdetails[0] =="csidspecific"){
          return {
            ...state,
            isshowpagedetails : false,
            issubmitbuttonvisible : false,
            isskipbuttonvisible : false,
            iszoneheadingvisibe : false,
            isdynamiczonevisibe : false
          }
      }
      else {      
          let correct_details = storescriptdetails(
            state.isbulkprocess ? state.selected_paper : action.payload.scriptdetails[0][2],
            action.payload.scriptdetails[0][0],
            action.payload.scriptdetails[1])
          return {
            ...state,
            selected_csid : action.payload.scriptdetails[0][0],
            pagecount : action.payload.scriptdetails[0][1],
            hiddenqpid : action.payload.scriptdetails[0][2],
            rownum : action.payload.scriptdetails[0][3],
            scriptdetails : action.payload.scriptdetails[1],
            correction_details : correct_details,
            isshowpagedetails : true,
            issubmitbuttonvisible : true,
            isskipbuttonvisible : isskipbuttonvis,
            iszoneheadingvisibe : true,
            isdynamiczonevisibe : true,
            success_retrivescripts : 'success',
            isdialogboxopen : false
          }
    }
    case ActionTypes.OPEN_EXCEPTION_DIALOG:
      let comments = ''
      let exceptionid = -1
      let cmtmandatory = false

      if(action.payload.iseditmode){
        let docpageid = action.payload.selected_docpageid
        let findcorindex = state.correction_details.findIndex(x => x[2] == docpageid)
        exceptionid = state.correction_details[findcorindex][4]
        comments = state.correction_details[findcorindex][5]
        cmtmandatory = state.exceptionlist && 
                      state.exceptionlist.filter(function(v,i,a){return v[0] == exceptionid})[0][2]
      }

      return {
        ...state,
        selected_docpageid : action.payload.selected_docpageid,
        isexceptionstatusopen : action.payload.isdialogopen,
        commentsbypage : comments,
        selected_exception_id : exceptionid,
        iscmtmandatory : cmtmandatory
      }
    case ActionTypes.IS_BUSY_INDICATOR_OPEN:
      return {
        ...state,
        isBusyIndicatorOpen : action.payload.isBusyIndicatorOpen
      }
    case ActionTypes.SELECTED_EXCEPTION_STATUS:
      let iscmdmandatory = false
      if(action.payload.exceptionid != "-1"){
        iscmdmandatory = state.exceptionlist && 
                          state.exceptionlist.filter(function(v,i,a)
                          {return v[0] == action.payload.exceptionid})[0][2]
      }
      
      return{
        ...state,
        selected_exception_id : action.payload.exceptionid,
        iscmtmandatory : iscmdmandatory 
      }
    case ActionTypes.ADD_EXCEPTION_DOCPAGEID:
      let cor_details = state.correction_details

      let findcorindex = cor_details.findIndex(x => x[2] == action.payload.docpageid)
      if (cor_details && findcorindex != -1){

        cor_details.splice(findcorindex,1)
        cor_details.push([state.isbulkprocess ? state.selected_paper : state.hiddenqpid,
                          state.selected_csid,
                          action.payload.docpageid,
                          action.payload.accuracystatusid,
                          action.payload.exceptionid,
                          action.payload.comments])
      }

      let index = state.scriptdetails.findIndex(x => x[0] == action.payload.docpageid)

      state.scriptdetails[index][3] = 0
      state.scriptdetails[index][4] = action.payload.exceptionid
      state.scriptdetails[index][5] = action.payload.comments
    
      return{
        ...state,
        correction_details: cor_details,
        isexceptionstatusopen : false,
        renderedOn : Date.now()
      }
    case ActionTypes.SAVE_SUCCESS:
      return{
        ...state,
        success : action.payload.success
      }
    case ActionTypes.CHANGE_COMMENTS:
      return {
        ...state,
        commentsbypage : action.payload.commentsbypage
      }
    case ActionTypes.OPEN_DIALOG_BOX:
      return {
        ...state,
        isdialogboxopen : action.payload.isdialogopen
      }
    case ActionTypes.RESET_EXCEPTION:
        let corr_details = state.correction_details
      
        let findcorrindex = corr_details.findIndex(x => x[2] == action.payload.docpageid)
        if (corr_details && findcorrindex != -1){
          corr_details[findcorrindex][3] = 1
          corr_details[findcorrindex][4] = null
          corr_details[findcorrindex][5] = null
        }

        let c_index = state.scriptdetails.findIndex(x => x[0] == action.payload.docpageid)
        state.scriptdetails[c_index][3] = 1
        state.scriptdetails[c_index][4] = null
        state.scriptdetails[c_index][5] = null
        return {
          ...state,
          correction_details : corr_details,
          renderedOn : Date.now()
        }
    default:
      return state;
  }
}

const storescriptdetails = (paper_id,csid,correction_details) => {
 let details = []
  correction_details.forEach(element => { 
    details.push([paper_id,csid,element[0],element[3],element[4],element[5]])
  });

  return details
}
