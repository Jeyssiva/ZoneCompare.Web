import React from 'react'
import ExceptionStatus from '../src/components/exceptionstatus'
import Spinner from '../src/components/spinner'
import MainSearch from '../src/components/mainsearch'
import DialogBox from '../src/components/dialogbox'

class App extends React.Component{
  render(){
    return(
      <React.Fragment>
        <ExceptionStatus/>
        <DialogBox />
        <Spinner/>
        <MainSearch/>
      </React.Fragment>
    )
  }
}
export default App
