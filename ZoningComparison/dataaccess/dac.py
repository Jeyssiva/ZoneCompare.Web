from ZoningComparison.dataaccess import repository
import config

class DAC():
    def __init__(self):
        self.config = config.APIS['settings']
        self.exambodyid = self.config['exambodyid']
        self.is_manual = self.config['is_manual_verification_required']
        self.duration_csid = self.config['duration_for_resume_csid']

    def getseries(self):
        query = "dbo.Session_Details_Get"
        repo = repository.Repository()
        return repo.get_details(query,self.exambodyid)
    
    def getcomponent(self,seriesid):
        query = "dbo.Component_Details_Get"
        repo = repository.Repository()
        return repo.get_details(query,seriesid)

    def getquestionpaper(self,esid):
        query = "dbo.Paper_Details_Get"
        repo = repository.Repository()
        return repo.get_details(query,esid)

    def getunprocessedcsidbasedesid(self,esid,rownum):
        query = "dbo.Candidate_Script_Get"
        repo = repository.Repository()
        return repo.get_specfic_query_result_az_spname(query,esid,rownum,self.is_manual,self.duration_csid)

    def getspecificpagezoningofcandidatescript(self, csid):       
        query = "dbo.Zone_Details_Get_For_Correction"
        repo = repository.Repository()
        docpages_zoned,csdet = repo.get_many_query_results_ass(query,csid)
        return [docpages_zoned,csdet]

    def getexceptiondetailsfromautozonedb(self):
        query = "dbo.Exception_Details_Get"              
        repo = repository.Repository()
        return repo.getexceptiondetails(query)

    def exceptiondetailsavebulktoautozonedb(self, results, currentdatetime):
        query = "dbo.Exception_Details_Save"
        repo = repository.Repository()
        return repo.exception_details_save_bulk(query, results, currentdatetime)

    def getimagelocation_output_xml(self,csid):
        query = "dbo.Image_Location_Output_Xml_Get"
        repo = repository.Repository()
        return repo.getdocpageslocationpathandoutputxml_az(query,csid)
        
    def validate_candidatescript(self,csid):
        query = "dbo.Candidate_Script_Validation"
        repo = repository.Repository()
        return repo.validate_candidatescript(query,csid,self.is_manual)