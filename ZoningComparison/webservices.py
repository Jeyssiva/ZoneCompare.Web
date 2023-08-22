
import json
from flask import render_template, jsonify, request, Response
from datetime import datetime
from ZoningComparison import app
from ZoningComparison.dataaccess import dachelper,dac
from ZoningComparison import loaddocument
from xml.dom import minidom
from matplotlib import pyplot as plt
import cv2
import os

@app.route('/comparison')
def comparison():
    
    return render_template(
            'comparison.html',
            year=datetime.now().year
    )
    
@app.route('/')
@app.route('/index')
def index():    
    return render_template('index.html', year=datetime.now().year)

@app.route('/api/series/', methods=['POST','GET'])
def series():
    try:
        session_result = []
        _dac = dac.DAC()
        _result = _dac.getseries()
        for rows in _result:
            sid,sname = rows
            session_result.append([sid,sname])     
    except Exception as ex:
        print(ex)
    else:
        return jsonify(session_result)

@app.route('/api/exceptionstatus/',methods=['POST','GET'])
def loadexceptionstatus():
    try:
        #Get the exception types 
        _excep_result = []
        _dac = dac.DAC()
        _result = _dac.getexceptiondetailsfromautozonedb()
        for rows in _result:
            eid,ename,iscmtmandatory = rows
            _excep_result.append([eid,ename,iscmtmandatory])
    except Exception as ex:
        print(ex)
    else:
        return jsonify(_excep_result)

@app.route('/api/component/', methods=['POST','GET'])
def component():
    try:
        component_result = []
        seriesid = request.args['sessionid']
        _dac = dac.DAC()
        _result = _dac.getcomponent(seriesid)
        for rows in _result:
            esid,compname = rows
            component_result.append([esid,compname])
    except Exception as ex:
        print(ex)
    else:
        return jsonify(component_result)

@app.route('/api/questionpaper/', methods=['POST','GET'])
def questionpaper():
    try:
        qp_result = []
        esid = request.args['esid']
        _dac = dac.DAC()
        _result = _dac.getquestionpaper(esid)
        for rows in _result:
            qpid,qpname = rows
            qp_result.append([qpid,qpname])
    except Exception as ex:
        print(ex)
    else:
        return jsonify(qp_result)

@app.route('/api/candidatescriptids/', methods=['POST','GET'])
def getcandidatescriptids():
    try:
        esid = request.args['esid']
        qpid = request.args['qpid']
        csid = request.args['csid']
        isprev = request.args['isprev']
        isnext = request.args['isnext']
        rownum = request.args['rownum']           
        _results = processdocuments(esid,qpid,csid,isprev,isnext,rownum)
    except Exception as ex:
        print(ex)
    else:
        return jsonify(_results)

def processdocuments(esid,qpid,csid,isprev,isnext,rownum):
    try:
        _results = []
        if esid != '-1':
            _dachelper = dachelper.DacHelper()
            docpages_zoned,csid, imagelocationsandoutputxml,rownumber = _dachelper.getunprocesscsid(esid,isprev,isnext,rownum)
      
            if(docpages_zoned == None):                                
                _results.append('no scripts')
            elif(docpages_zoned == 'unzoned'):
                 _results.append('unzoned')
            else:
                _results.append([csid, len(imagelocationsandoutputxml),qpid,rownumber])

                #get the documents based on csid
                _ld = loaddocument.loadDocument()
                tag_files_for_individual = _ld.getdocuments(csid,docpages_zoned, imagelocationsandoutputxml)           
                _results.append(tag_files_for_individual)

        elif csid != '-1':
            _dachelper = dachelper.DacHelper()
            docpages_zoned,csdet,imagelocationsandoutputxml = _dachelper.getpagezoneofcsid(csid)
            if(docpages_zoned == None): 
                _results.append('no scripts')
            elif(docpages_zoned == 'unzoned'):
                _results.append('unzoned')
            else:
                _results.append([csid, len(imagelocationsandoutputxml),csdet[0][0],1])

                #get the documents based on csid
                _ld = loaddocument.loadDocument()
                tag_files_for_individual = _ld.getdocuments(csid,docpages_zoned, imagelocationsandoutputxml)
                _results.append(tag_files_for_individual)
    except Exception as ex:
        print(ex)
    else:
        return _results

@app.route('/api/exceptionsavebulk/', methods=['POST','GET'])
def exceptionsavebulk():
    try:
        esid = request.args['esid']
        qpid = request.args['qpid']
        csid = request.args['csid']
        rownum = request.args['rownum']
        results = json.loads(request.args['results'])
        _results = []
        _dac = dac.DAC()
        currentdatetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        _result =  _dac.exceptiondetailsavebulktoautozonedb(results, currentdatetime)

        if(_result == "success" and csid == '-1'):
            _results = processdocuments(esid,qpid,csid,"false","false",rownum)
        else:
            _results.append('csidspecific')
        
    except Exception as ex:
        print(ex)
    else:
        return jsonify(_results)