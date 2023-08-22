import React from 'react';

class Button extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
       return ( <button 
        id={this.props.id}
        value={this.props.value}
        className = {this.props.className}
        onClick={this.onClick}>{this.props.value}</button>
       )
    }

    onClick = () => {
        this.props.onClick();
    }
}

export default Button