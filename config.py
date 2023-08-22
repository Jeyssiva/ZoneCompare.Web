
DBS = {
    'assessor-db':{
        'server':'52.169.72.217',
        'port_ass' : '1433',
        'database':'SCORIS_IBO_Anon_Sep18',
        'integratedsecurity':'SSPI',
        'multipleactiveresultssets':'true',
        'username': 'rmautozoning.admin',
        'password': 'Autozoningdb1234'
    },
    'autozone-db': {
        'server': 'rm-automark-sqldb.database.windows.net',
        'database': 'rm-autozoning-db-01',
        'username': 'rmautomarkdb.admin',
        'password': 'Automarkdb1234',
        'port_az' : '1433'
    }
}

APIS = {
    'settings':{
        'exambodyid':'2',
        'is_manual_verification_required' : 1,
        'duration_for_resume_csid': 30
    }
}

BLOCKBLOBSERVICE = {
    'liveimages': {
    # 'account_name': 'asrdevr52docstore01',
    # 'container_name': 'r52devib',
    'account_name': 'autozoningtestaccount',
    'container_name' : 'docstoreib2018',
    'key': 'Ji5od2I3L6VFO1IIRVVja2fpj2cRyOXLURHFGnbqTsJ00nzgI5ogbYgKXZjRs4G6nftynXVL4ujRShzsASjktg==',
    'sas_token' : 'sv=2018-03-28&ss=b&srt=sco&sp=r&se=2019-07-15T14:05:15Z&st=2019-05-14T06:05:15Z&spr=https,http&sig=HYoRsqRJNSWkxMXdXppfoeedRZRcIOvcuvmZ8kt2Hrc%3D',
    'retries': 3,
    'retry_in_seconds': 5,
    'url': 'https://asrdevr52docstore01.blob.core.windows.net'
 }
}