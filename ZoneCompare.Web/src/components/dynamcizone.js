import React from 'react';
import { connect } from 'react-redux'
import {
    openexceptionstatusdialog,
    resetexception
} from '../actions/loaddata'
let classNames = require('classnames')

class DynamicZone extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){      
        const iconclassnames  = classNames('imgexcepicon',
                                {'controlblock' : this.props.isexceptioniconvisible == 0},
                                {'controlnone' : this.props.isexceptioniconvisible == 1})  

        const excepchecked = this.props.ischecked == 1 ? true : false

       return (
            <div id = {"divmain_" + this.props.docpageid}>
                <div className={"div-checkbox"} id={"cdiv_" + this.props.docpageid}>
                    <input type={"checkbox"} 
                        name = {"chkaccuracy"} 
                        className = {"checkbox"} 
                        id = {"chk_" +this.props.docpageid} 
                        checked = {excepchecked}
                        onClick={this.onCheckboxClick}>
                    </input>
                    <input type={"image"} className={iconclassnames}
                            id = {"imgeicon_" + this.props.docpageid} 
                            src = {"/static/images/exception_icon.png"}
                            onClick = {this.onIconClick}>
                    </input>
                </div>
              <div id = {"adiv_" +this.props.docpageid} className = {"div-zone-size"}>
                    <img id = {"aimg_" +this.props.docpageid} 
                    src = {"data:image/jpg;base64," + this.props.autozone_images}
                    className = {"image-border"}>
                    </img>
              </div>
              <div id = {"mdiv_" +this.props.docpageid} className = {"div-zone-size div-manual-position"}>
              <img id = {"mimg_" +this.props.docpageid} 
                    src = {"data:image/jpg;base64," + this.props.manualzone_images}
                    className = {"image-border"}>
                </img>
              </div>
              <br></br>
            </div>
       )
    }

    onIconClick = (e) => {
        let u_docpageid = e.target.id.split('_')[1]
        this.props.openexceptionstatusdialog(u_docpageid,true,true)

    }
    
    onCheckboxClick = (e) => {
        if(e.target.checked == false){
            let s_docpageid = e.target.id.split('_')[1]
            this.props.openexceptionstatusdialog(s_docpageid,true,false)
        } else{
            if(confirm('Ticking the box will delete the exception already raised against this page. Are you sure you want to Proceed?')){
                this.props.resetexception(e.target.id.split('_')[1])
            }
        }
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        openexceptionstatusdialog : (docpageid,isdialogopen,editmode) => 
        dispatch(openexceptionstatusdialog(docpageid,isdialogopen,editmode)),

        resetexception : (docpageid) => dispatch(resetexception(docpageid))
    }
}

export default connect(null,mapDispatchToProps)(DynamicZone);