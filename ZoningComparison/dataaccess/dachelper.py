from ZoningComparison.dataaccess import dac
from ZoningComparison.logger import logger

class DacHelper():

    def __init__(self):
        self._logger = logger.Logger() 

    def getunprocesscsid(self,esid,isprev,isnext,rownum):
        try:
            _dac = dac.DAC()

            if(isnext == 'true'):
                unprocesscsidwithrownum = _dac.getunprocessedcsidbasedesid(esid,int(rownum) + 1)
            else:
                unprocesscsidwithrownum = _dac.getunprocessedcsidbasedesid(esid,1)
            if(unprocesscsidwithrownum != None and len(unprocesscsidwithrownum) > 0):
                imagelocationsandoutputxml = _dac.getimagelocation_output_xml(unprocesscsidwithrownum[0][1])
                docpage_zones,cs_det,outputxml = self.validatezoning(imagelocationsandoutputxml,unprocesscsidwithrownum[0][1],1)
                return [ docpage_zones,cs_det,outputxml, unprocesscsidwithrownum[0][0]]
            else:
                return [None,None,None, None]
        except Exception as ex:
            self._logger.log_exception(ex)

    def getpagezoneofcsid(self,csid):
        try:
            _dac = dac.DAC()
            is_valid = _dac.validate_candidatescript(csid)
            if(is_valid == True):
                imagelocationsandoutputxml = _dac.getimagelocation_output_xml(csid) #csid
                return self.validatezoning(imagelocationsandoutputxml,csid,0)           
            else:
                return [None,None,None]
        except Exception as ex:
            self._logger.log_exception(ex)

    def validatezoning(self,imagelocationsandoutputxml,csid,isbulkprocess):
        try:
            _dac = dac.DAC()
            if(len(imagelocationsandoutputxml) > 0):
                unzonedimages = [x for x in imagelocationsandoutputxml if x[9] <= 3] #AutomarkStatus != XML Generated
                if(len(imagelocationsandoutputxml) == len(unzonedimages)):
                    return ['unzoned',None,None]
                else:
                    docpages_zoned,csdet = _dac.getspecificpagezoningofcandidatescript(csid) #csid
                    if(isbulkprocess == 1):
                        return [docpages_zoned,csid, imagelocationsandoutputxml]
                    else:
                        return [docpages_zoned,csdet, imagelocationsandoutputxml]
            else:
                return [None,None,None] 
        except Exception as ex:
            self._logger.log_exception(ex)  

