import config
import pyodbc

class DbConnection:
    def __init__(self):
        self.config = config.DBS['assessor-db']
        self.server = self.config['server']
        self.database = self.config['database']
        self.driver = '{SQL Server Native Client 11.0}'
        self.username_ass = self.config['username']
        self.password_ass = self.config['password']
        self.port_ass = self.config['port_ass']
        self.connection = None

        self.config_az = config.DBS['autozone-db']
        self.server_az = self.config_az['server']
        self.database_az = self.config_az['database']
        self.driver_az = '{ODBC Driver 17 for SQL Server}'
        self.username = self.config_az['username']
        self.password = self.config_az['password']
        self.port_az = self.config_az['port_az']
        self.connection_az = None

    def get_connection_assessor_db(self):
        try:
            connection_string = 'DRIVER='+ self.driver_az +';SERVER=' + self.server +';PORT='+ \
            self.port_ass +';DATABASE=' + self.database + ';UID=' + self.username_ass + ';PWD=' \
            + self.password_ass
            if self.connection:
                return self.connection 
            else:
                self.connection = pyodbc.connect(connection_string)
                return self.connection
                
        except Exception as ex:
            print('Database connect failed ' + ex)

    def get_connection_autozone_db(self):
        try:
            connection_string_az = 'DRIVER=' + self.driver + ';SERVER=' + self.server_az +';PORT=' + \
            self.port_az +';DATABASE=' + self.database_az + ';UID=' + self.username + ';PWD=' + self.password
            if self.connection_az:
                return self.connection_az
            else:
                self.connection_az = pyodbc.connect(connection_string_az)
                return self.connection_az
                
        except Exception as ex:
            print('Database connect failed ' + ex)
