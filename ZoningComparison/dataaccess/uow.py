import numpy as np
from ZoningComparison.dataaccess import dbconnection
from ZoningComparison.logger import logger
import datetime

class UOW:

    def uow_assessor_db(self):
        self.db_ass = dbconnection.DbConnection()
        self.connection_ass = self.db_ass.get_connection_assessor_db()
        self.cursor_ass = self.connection_ass.cursor()    
        self._logger = logger.Logger()    
    
    def uow_autozone_db(self):
        self.db_az = dbconnection.DbConnection()
        self.connection_az = self.db_az.get_connection_autozone_db()
        self.cursor_az = self.connection_az.cursor()
        self._logger = logger.Logger()

    def execute_ass(self, command, values):
        try:
            if 'INSERT' in command:
                self.cursor_ass.execute(command, values)
                self.cursor_ass.execute("SELECT @@IDENTITY")
                row = self.cursor_ass.fetchone()
                seed_id = row[0]
                self.cursor_ass.commit()
                return seed_id

            elif 'UPDATE' in command or 'DELETE' in command:
                self.cursor_ass.execute(command, values)
                rows_affected = self.cursor_ass.rowcount
                self.cursor_ass.commit()
                return rows_affected
    
            elif 'SELECT' in command:
                if values is None:
                    self.cursor_ass.execute(command)
                else:
                    self.cursor_ass.execute(command, values)

                rows = self.cursor_ass.fetchall()
                return rows

            elif 'EXEC' in command:                    
                '''elf.connection_ass.autocommit = True
                self.cursor_ass.execute(command)
                rows = self.cursor_ass.fetchmany()'''
                pass

        except Exception as ex:
            self._logger.log_exception(ex)

        finally:
            self.cursor_ass.close()
            self.connection_ass.close()

    def execute_many_ass(self, spname, data):
        try:
            sql = 'EXEC ' + spname + ' ?;'
            values = (data)
            self.cursor_ass.execute(sql,values)
            docpages_zoned = self.cursor_ass.fetchall()

            self.cursor_ass.nextset()
            csdet = self.cursor_ass.fetchall()

            return [docpages_zoned,csdet]

        except Exception as ex:
            self._logger.log_exception(ex)

        finally:
            self.cursor_ass.close()
            self.connection_ass.close()

    def getdocpageslocationpathandoutputxml_az(self,spname,csid):
        try:
            sql = 'EXEC ' + spname + ' ?;'
            values = (csid)
            self.cursor_az.execute(sql,values)
            imagelocations = self.cursor_az.fetchall()
            return imagelocations
        except Exception as ex:
            self._logger.log_exception(ex)
        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def execute_az(self, command, values):
        try:
            if 'INSERT' in command:
                self.cursor_az.execute(command, values)
                self.cursor_az.execute("SELECT @@IDENTITY")
                row = self.cursor_az.fetchone()
                seed_id = row[0]
                self.cursor_az.commit()
                return seed_id

            elif 'UPDATE' in command or 'DELETE' in command:
                self.cursor_az.execute(command, values)
                rows_affected = self.cursor_az.rowcount
                self.cursor_az.commit()
                return rows_affected
    
            elif 'SELECT' in command:
                if values is None:
                    self.cursor_az.execute(command)
                else:
                    self.cursor_az.execute(command, values)

                rows = self.cursor_az.fetchall()
                return rows

            elif 'EXEC' in command:
                self.connection_az.autocommit = True
                self.cursor_az.execute(command)
                rows = self.cursor_az.fetchall()
                return rows

        except Exception as ex:
            self._logger.log_exception(ex)

        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def get_candidate_scripts(self,command,rownum,esid,is_manual,duration_csid):
        try:
            sql = 'EXEC ' + command + ' ?, ?, ?, ?;'
            values = (esid,rownum,is_manual,duration_csid)
            self.cursor_az.execute(sql,values)
            rows = self.cursor_az.fetchall()
            self.cursor_az.commit()
            self.connection_az.commit()
           
            return rows
        except Exception as ex:
            self._logger.log_exception(ex)

        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def exception_details_save(self, command, qp_id, cs_id, dp_id, iscorrect, excep_type_id, comments):
        try:
            sql = 'EXEC ' + command + ' ?, ?, ?, ?, ?, ?;'
            values = (qp_id,cs_id,dp_id,iscorrect,excep_type_id,comments)
            self.cursor_ass.execute(sql,values)

        except Exception as ex:
            self._logger.log_exception(ex)

        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def exception_details_save_bulk(self,query,results, currentdatetime):
        try:
            for row in results:
                if(row[4] != None):
                    excepid = int(row[4])
                else:
                    excepid = None

                sql = 'EXEC ' + query + ' ?, ?, ?, ?, ?, ?, ?' 
                values = (int(row[0]),int(row[1]),int(row[2]),int(row[3]),excepid,row[5], currentdatetime)
                self.cursor_az.execute(sql,values)
                self.cursor_az.commit()
                self.connection_az.commit()
            return 'success'

        except Exception as ex:
            self._logger.log_exception(ex)
            return ex

        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def getexceptiondetails(self,spname):
        try:
            sql = 'EXEC ' + spname + ' ;'
            self.cursor_az.execute(sql)
            excepdetails = self.cursor_az.fetchall()
            return excepdetails
        except Exception as ex:
            self._logger.log_exception(ex)
        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def validate_candidatescript(self,spname,csid,is_manual_needed):
        try:
            sql = 'EXEC ' + spname + ' ?, ?;'
            values = (csid,is_manual_needed)
            self.cursor_az.execute(sql,values)
            is_valid = self.cursor_az.fetchone()
            return is_valid[0]
        except Exception as ex:
            self._logger.log_exception(ex)
        finally:
            self.cursor_az.close()
            self.connection_az.close()

    def get_details(self,spname,value):
        try:
            sql = 'EXEC ' + spname + ' ?;'
            values = (value)
            self.cursor_ass.execute(sql,values)
            details = self.cursor_ass.fetchall()
            return details
        except Exception as ex:
            self._logger.log_exception(ex)
        finally:
            self.cursor_ass.close()
            self.connection_ass.close()