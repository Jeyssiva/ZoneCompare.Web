from ZoningComparison.dataaccess import uow

class Repository():

    def __init__(self):
        self.uow = uow.UOW()
        self.uow_ass = self.uow.uow_assessor_db()
        self.uow_az = self.uow.uow_autozone_db()

    def get_specfic_query_result_ass(self, query):      
        result = self.uow.execute_ass(query, None)
        return result

    def get_many_query_results_ass(self,spname,data):
        docpages_zoned,csdet = self.uow.execute_many_ass(spname,data)
        return [docpages_zoned,csdet]

    def get_specfic_query_result_az(self, query):
        result = self.uow.execute_az(query, None)
        return result

    def get_specfic_query_result_az_spname(self, query,esid,rownum,is_manual,duration_csid):
        result = self.uow.get_candidate_scripts(query,rownum,esid,is_manual,duration_csid)
        return result

    def exception_details_save_bulk(self,query,results, currentdatetime):
        result = self.uow.exception_details_save_bulk(query,results, currentdatetime)
        return result

    def getdocpageslocationpathandoutputxml_az(self,command,csid):
        locations = self.uow.getdocpageslocationpathandoutputxml_az(command,csid)
        return locations

    def getexceptiondetails(self,query):
        excepdetails = self.uow.getexceptiondetails(query)
        return excepdetails
        
    def validate_candidatescript(self,spname,csid,is_manual_needed):
        is_valid = self.uow.validate_candidatescript(spname,csid,is_manual_needed)
        return is_valid

    def get_details(self, query,value):
        result = self.uow.get_details(query, value)
        return result