import React from 'react';

class ZoneHeading extends React.Component{
    render(){
        return (
            <div id={"zoneheading"} className={this.props.iszoneheadingvisibe}>
                    <table className={"zoneheader"}>
                        <tbody>
                            <tr>
                                <td className = {"maintdwidth48"}><label className={"font-details"}>Autozoning:</label></td>
                                <td><label className={"font-details"}>Manualzoning:</label></td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        )}
} export default (ZoneHeading)